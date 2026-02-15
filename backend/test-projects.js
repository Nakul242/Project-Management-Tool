// Using native fetch (Node 18+)

const BASE_URL = 'http://localhost:5000/api';

async function testProjectCRUD() {
    try {
        console.log('--- Authenticating ---');
        // 1. Login to get token
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com', // Using the user created in previous test
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        const cookie = loginRes.headers.get('set-cookie');

        if (!token) throw new Error('Authentication failed (No token)');
        console.log('Authenticated as:', loginData.user.username);

        const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cookie': cookie || ''
        };

        console.log('\n--- Creating Project ---');
        // 2. Create Project
        const createRes = await fetch(`${BASE_URL}/projects`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Test Project ' + Date.now(),
                description: 'This is a test project created by script'
            })
        });
        const createData = await createRes.json();
        console.log('Create Status:', createRes.status);
        console.log('Project ID:', createData.data?._id);

        if (!createData.success) throw new Error('Create Project failed: ' + createData.error);
        const projectId = createData.data._id;

        console.log('\n--- Getting All Projects ---');
        // 3. Get Projects
        const getRes = await fetch(`${BASE_URL}/projects`, {
            method: 'GET',
            headers: authHeaders
        });
        const getData = await getRes.json();
        console.log('Get Status:', getRes.status);
        console.log('Projects Count:', getData.count);

        if (!getData.success) throw new Error('Get Projects failed');

        console.log('\n--- Updating Project ---');
        // 4. Update Project
        const updateRes = await fetch(`${BASE_URL}/projects/${projectId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Updated Project Title',
                description: 'Updated description'
            })
        });
        const updateData = await updateRes.json();
        console.log('Update Status:', updateRes.status);
        console.log('Updated Title:', updateData.data?.title);

        if (!updateData.success) throw new Error('Update Project failed');

        console.log('\n--- Deleting Project ---');
        // 5. Delete Project
        const deleteRes = await fetch(`${BASE_URL}/projects/${projectId}`, {
            method: 'DELETE',
            headers: authHeaders
        });
        const deleteData = await deleteRes.json();
        console.log('Delete Status:', deleteRes.status);

        if (!deleteData.success) throw new Error('Delete Project failed');

        console.log('\n✅ ALL PROJECT TESTS PASSED');

    } catch (err) {
        console.error('\n❌ TEST FAILED:', err.message);
    }
}

testProjectCRUD();
