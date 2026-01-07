import Script from "next/script";

export default function FoxTestPage() {
  return (
    <html>
      <head>
        <title>Fox Test</title>
      </head>
      <body style={{ margin: 0, padding: 0, background: "#1a1a2e", minHeight: "100vh" }}>
        {/* Load model-viewer script */}
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="beforeInteractive"
        />
        
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "100vh",
          padding: "20px"
        }}>
          <h1 style={{ color: "white", marginBottom: "20px" }}>🦊 Fox AR Test</h1>
          <p style={{ color: "white", marginBottom: "20px" }}>
            If you see a 3D fox below, the model is working!
          </p>
          
          {/* @ts-ignore */}
          <model-viewer
            src="/models/vr-foxy-0000/animations/idle/vrfoxy_idle.glb"
            ios-src="/models/vr-foxy-0000/animations/idle/vrfoxy_idle.usdz"
            alt="Test Fox"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity="0.5"
            exposure="0.8"
            environment-image="neutral"
            style={{
              width: "100%",
              maxWidth: "600px",
              height: "500px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "16px"
            }}
          />
          
          <div style={{ marginTop: "20px", color: "white", textAlign: "center" }}>
            <p>✅ GLB: /models/vr-foxy-0000/animations/idle/vrfoxy_idle.glb</p>
            <p>✅ USDZ: /models/vr-foxy-0000/animations/idle/vrfoxy_idle.usdz</p>
            <p style={{ marginTop: "10px", color: "#FF8A3D" }}>
              On iPhone: Tap the AR cube icon → View in AR
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
