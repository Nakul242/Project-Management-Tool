// Using native fetch (Node 18+)

// Check if fetch is available (Node 18+), otherwise we might need to install it or use http module.
// Assuming Node 18+ for this environment.

const BASE_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
    try {
        console.log('--- Testing Registration ---');
        const regRes = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'test_script_user_' + Date.now(),
                email: `test${Date.now()}@example.com`,
                password: 'password123'
            })
        });
        const regData = await regRes.json();
        console.log('Register Status:', regRes.status);
        console.log('Register Response:', regData);

        if (!regData.success) throw new Error('Registration failed');

        console.log('\n--- Testing Login ---');
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: regData.user.email,
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        if (loginData.token) console.log('Token received');

        // Extract cookie if present
        const cookie = loginRes.headers.get('set-cookie');
        console.log('Cookie:', cookie ? 'Received' : 'Not Received');

        if (!loginData.success) throw new Error('Login failed');

        console.log('\n--- Testing Get Me (Protected) ---');
        const token = loginData.token;
        const meRes = await fetch(`${BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cookie': cookie || ''
            }
        });
        const meData = await meRes.json();
        console.log('Me Status:', meRes.status);
        console.log('Me Response:', meData);

        if (!meData.success) throw new Error('Get Me failed');

        console.log('\n✅ ALL AUTH TESTS PASSED');

    } catch (err) {
        console.error('\n❌ TEST FAILED:', err.message);
    }
}

testAuth();
