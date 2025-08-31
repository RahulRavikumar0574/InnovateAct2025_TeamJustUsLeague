#include <Wire.h>
#include <MPU6050.h>
#include <DHT11.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// -------------------- WiFi Setup --------------------
const char* ssid = "Abishek";
const char* password = "godabishek";

// Server & ESP B endpoints
const char* serverURL = "http://192.168.242.7:5000/data";
const char* sosServerURL = "http://192.168.242.7:5000/sos";
const char* espB_URL = "http://192.168.242.251:5000/sos"; // ESP B IP in LAN

// -------------------- MPU6050 Setup --------------------
MPU6050 mpu;
const int CRASH_THRESHOLD = 18500;   // ~2.7g (tune as needed)

// -------------------- Buzzer & LED --------------------
#define BUZZER_PIN D5
#define LED_PIN D6

// -------------------- DHT11 Setup --------------------
#define DHTPIN D4
DHT11 dht11(DHTPIN);

void setup() {
  Serial.begin(115200);
  Wire.begin();

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);  // LED off initially

  // WiFi
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected!");
  Serial.print("ESP Main IP: ");
  Serial.println(WiFi.localIP());

  // MPU6050
  Serial.println("Initializing MPU6050...");
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("❌ MPU6050 connection failed!");
    while (1);
  }
  Serial.println("MPU6050 ready.");

  Serial.println("DHT11 ready.");
}

void sendSOStoESPB(bool crashDetected) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClient client;
  HTTPClient http;
  if (http.begin(client, espB_URL)) {
    http.addHeader("Content-Type", "application/json");
    String sosData = crashDetected ? "{\"sos\":true}" : "{\"sos\":false}";
    int code = http.POST(sosData);
    if (code > 0) {
      Serial.print("🔹 SOS sent to ESP B: ");
      Serial.println(sosData);
    } else {
      Serial.print("❌ Failed sending SOS to ESP B: ");
      Serial.println(http.errorToString(code));
    }
    http.end();
  }
}

void loop() {
  // ---- MPU6050 Crash Detection ----
  int16_t ax, ay, az;
  int16_t gx, gy, gz;
  mpu.getAcceleration(&ax, &ay, &az);
  mpu.getRotation(&gx, &gy, &gz);

  long accelMagnitude = sqrt((long)ax*ax + (long)ay*ay + (long)az*az);
  bool crashDetected = false;

  if (accelMagnitude > CRASH_THRESHOLD) {
    Serial.println("🚨 CRASH DETECTED!");
    crashDetected = true;

    // ---- Buzzer 3s ----
    unsigned long buzzerStart = millis();
    while (millis() - buzzerStart < 3000) {
      tone(BUZZER_PIN, 500);
    }
    noTone(BUZZER_PIN);

    // ---- LED Blink 6s ----
    unsigned long ledStart = millis();
    while (millis() - ledStart < 6000) {
      digitalWrite(LED_PIN, LOW);
      delay(250);
      digitalWrite(LED_PIN, HIGH);
      delay(250);
    }
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, HIGH);
  }

  // ---- DHT11 Temp/Humidity ----
  int temperature = 0, humidity = 0;
  int res = dht11.readTemperatureHumidity(temperature, humidity);
  if (res != 0) Serial.println("❌ DHT11 error");
  
  // ---- Send Data to Server ----
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    if (http.begin(client, serverURL)) {
      http.addHeader("Content-Type", "application/json");
      String jsonData = "{";
      jsonData += "\"status\":\"" + String(crashDetected ? "crash" : "normal") + "\",";
      jsonData += "\"temperature\":" + String(temperature) + ",";
      jsonData += "\"humidity\":" + String(humidity) + "}";
      int httpCode = http.POST(jsonData);
      if (httpCode > 0) Serial.println("📡 Data sent to server");
      http.end();
    }
  }

  // ---- Send SOS to Server ----
  if (WiFi.status() == WL_CONNECTED && crashDetected) {
    WiFiClient client;
    HTTPClient http;
    if (http.begin(client, sosServerURL)) {
      http.addHeader("Content-Type", "application/json");
      String sosData = "{\"sos\":true}";
      int code = http.POST(sosData);
      if (code > 0) Serial.println("🔹 SOS sent to server");
      http.end();
    }
  }

  // ---- Send SOS to ESP B ----
  if (crashDetected) sendSOStoESPB(true);

  // ---- Check SOS from server (website) ----
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    if (http.begin(client, sosServerURL)) {
      int code = http.GET();
      if (code > 0) {
        String payload = http.getString();
        Serial.print("🔄 SOS from website: ");
        Serial.println(payload);
        if (payload.indexOf("true") >= 0) {
          Serial.println("🚨 SOS ACTIVATED from website!");
          // ---- Buzzer + LED for website SOS ----
          tone(BUZZER_PIN, 800, 2000);
          for (int i = 0; i < 6; i++) {
            digitalWrite(LED_PIN, LOW);
            delay(200);
            digitalWrite(LED_PIN, HIGH);
            delay(200);
          }
        }
      }
      http.end();
    }
  }

  delay(2000);
}
