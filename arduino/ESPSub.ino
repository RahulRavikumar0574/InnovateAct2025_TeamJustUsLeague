#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "Abishek";
const char* password = "godabishek";

// Website/server endpoint (for website polling)
const char* sosURL = "http://192.168.242.7:5000/sos";

#define BUZZER_PIN D5  
#define LED_PIN D6     

ESP8266WebServer server(5000);  // Local server for ESP Main
bool sosActive = false;

// ---- Handle SOS POST from ESP Main ----
void handleSOS() {
  if (server.hasArg("plain")) {
    String body = server.arg("plain");
    Serial.print("📩 SOS POST body (from ESP Main): ");
    Serial.println(body);

    if (body.indexOf("true") >= 0) {
      sosActive = true;
      Serial.println("🚨 SOS received from ESP Main!");
    } else {
      sosActive = false;
      Serial.println("✅ SOS cleared from ESP Main!");
    }
  } else {
    Serial.println("⚠ No body received in POST from ESP Main!");
  }

  server.send(200, "application/json", "{\"status\":\"ok\"}");
}

// ---- Trigger Alarm ----
void triggerAlarm() {
  digitalWrite(BUZZER_PIN, LOW); // buzzer on
  for (int i = 0; i < 6; i++) {
    digitalWrite(LED_PIN, LOW);  
    delay(250);
    digitalWrite(LED_PIN, HIGH); 
    delay(250);
  }
  digitalWrite(BUZZER_PIN, HIGH); // buzzer off
  sosActive = false; // reset
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  // OFF initially (active-low)
  digitalWrite(BUZZER_PIN, HIGH);  
  digitalWrite(LED_PIN, HIGH);     

  // WiFi setup
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi connected!");
  Serial.print("📡 ESP B IP: "); 
  Serial.println(WiFi.localIP());

  // Start local server (listens to ESP Main)
  server.on("/sos", HTTP_POST, handleSOS);
  server.begin();
  Serial.println("📡 ESP B server ready at /sos (port 5000)");
}

void loop() {
  server.handleClient();  // Handle requests from ESP Main

  // ---- Poll Website SOS ----
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    if (http.begin(client, sosURL)) {
      int httpResponseCode = http.GET();
      if (httpResponseCode > 0) {
        String payload = http.getString();
        Serial.print("🔄 SOS status from website: ");
        Serial.println(payload);

        if (payload.indexOf("true") >= 0) {
          sosActive = true;
        } else if (payload.indexOf("false") >= 0) {
          sosActive = false;
        }
      } else {
        Serial.print("❌ Error checking website SOS: ");
        Serial.println(http.errorToString(httpResponseCode));
      }
      http.end();
    }
  }

  // ---- Run alarm if active ----
  if (sosActive) {
    triggerAlarm();
  }

  delay(2000); // poll every 2 sec
}
