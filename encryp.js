async function generatePayload(slug) {
    const key = "sd72-ai-prod";
    const enc = new TextEncoder();

    async function sha256Bytes(str) {
        const buf = await crypto.subtle.digest("SHA-256", enc.encode(str));
        return Array.from(new Uint8Array(buf));
    }

    let state = await sha256Bytes(key);
    const input = Array.from(enc.encode(slug));
    let output = [];

    for (let i = 0; i < input.length; i++) {
        const k = state[i % state.length];
        const val = input[i] ^ k ^ (output[i-1] || 0);
        output.push(val);
        state = await sha256Bytes(state.slice(0,16).join(","));
    }

    console.log("Payload =", JSON.stringify(output));
}

// Example
generatePayload("4rER83f");