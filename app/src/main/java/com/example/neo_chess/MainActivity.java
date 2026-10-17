package com.example.neo_chess;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.json.JSONObject;

import java.net.URI;

public class MainActivity extends AppCompatActivity {

    private WebView chessWebView;
    private WebSocketClient socket;

    @SuppressLint({"SetJavaScriptEnabled", "MissingInflatedId"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Fullscreen immersive mode
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN |
                        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                        View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        );

        setContentView(R.layout.activity_main);

        chessWebView = findViewById(R.id.chessWebView);

        WebSettings settings = chessWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setDefaultTextEncodingName("utf-8");

        chessWebView.setWebViewClient(new WebViewClient());

        // Expose sendMove() and room methods to JavaScript
        chessWebView.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public void sendMove(String move) {
                MainActivity.this.sendMove(move);
            }

            @JavascriptInterface
            public void joinRoom(String roomId, String playerName) {
                MainActivity.this.joinRoom(roomId, playerName);
            }

            @JavascriptInterface
            public void sendMessage(String json) {
                MainActivity.this.sendRawMessage(json);
            }
        }, "AndroidWebSocket");

        // Expose haptic feedback to JavaScript
        chessWebView.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public void vibrate(long ms) {
                try {
                    android.os.Vibrator v = (android.os.Vibrator) getSystemService(VIBRATOR_SERVICE);
                    if (v != null && v.hasVibrator()) {
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                            v.vibrate(android.os.VibrationEffect.createOneShot(ms, android.os.VibrationEffect.DEFAULT_AMPLITUDE));
                        } else {
                            v.vibrate(ms);
                        }
                    }
                } catch (Exception ignored) {}
            }
        }, "AndroidHaptics");

        // Expose dynamic connection to JavaScript
        chessWebView.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public void connect(String url) {
                runOnUiThread(() -> MainActivity.this.connectServer(url));
            }
        }, "AndroidConnection");

        // Load the HTML chess board from assets folder
        chessWebView.loadUrl("file:///android_asset/index.html");

        // Connect to WebSocket server for multiplayer
        connectServer();
    }

    private void connectServer() {
        connectServer("ws://192.168.1.5:8080");
    }

    public void connectServer(String serverUrl) {
        try {
            if (socket != null) {
                try {
                    socket.close();
                } catch (Exception ignored) {}
            }
            URI uri = new URI(serverUrl);

            socket = new WebSocketClient(uri) {
                @Override
                public void onOpen(ServerHandshake handshakedata) {
                    runOnUiThread(() -> {
                        System.out.println("Connected to Chess Server: " + serverUrl);
                        chessWebView.evaluateJavascript("if (window.onNetworkStatus) window.onNetworkStatus('CONNECTED');", null);
                    });
                }

                @Override
                public void onMessage(String message) {
                    runOnUiThread(() -> handleMessage(message));
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    runOnUiThread(() -> {
                        System.out.println("Disconnected from server: " + reason);
                        chessWebView.evaluateJavascript("if (window.onNetworkStatus) window.onNetworkStatus('DISCONNECTED');", null);
                    });
                }

                @Override
                public void onError(Exception ex) {
                    ex.printStackTrace();
                    runOnUiThread(() -> {
                        chessWebView.evaluateJavascript("if (window.onNetworkStatus) window.onNetworkStatus('ERROR');", null);
                    });
                }
            };

            socket.connect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleMessage(String message) {
        try {
            JSONObject data = new JSONObject(message);
            String type = data.getString("type");

            if (type.equals("move")) {
                String move = data.getString("move");
                chessWebView.evaluateJavascript("handleNetworkMove('" + move + "');", null);
            } else if (type.equals("assignColor")) {
                String color = data.getString("color");
                String room = data.optString("room", "");
                chessWebView.evaluateJavascript("setPlayerColor('" + color + "', '" + room + "');", null);
            } else if (type.equals("ready")) {
                String room = data.optString("room", "");
                String white = data.optString("white", "");
                String black = data.optString("black", "");
                chessWebView.evaluateJavascript("onNetworkGameReady('" + room + "', '" + white + "', '" + black + "');", null);
            } else if (type.equals("message")) {
                String text = data.optString("text", "");
                chessWebView.evaluateJavascript("onNetworkMessage('" + text + "');", null);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void joinRoom(String roomId, String playerName) {
        try {
            if (socket != null && socket.isOpen()) {
                JSONObject obj = new JSONObject();
                obj.put("type", "join");
                obj.put("room", roomId);
                obj.put("playerName", playerName);
                socket.send(obj.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendRawMessage(String json) {
        try {
            if (socket != null && socket.isOpen()) {
                socket.send(json);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendMove(String move) {
        try {
            if (socket != null && socket.isOpen()) {
                JSONObject obj = new JSONObject();
                obj.put("type", "move");
                obj.put("move", move);
                socket.send(obj.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Fullscreen focus
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_FULLSCREEN |
                            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            );
        }
    }

    @SuppressLint("GestureBackNavigation")
    @Override
    public void onBackPressed() {
        if (chessWebView.canGoBack()) {
            chessWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (socket != null) {
            socket.close();
        }
    }
}