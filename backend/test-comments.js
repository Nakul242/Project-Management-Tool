// Using native fetch (Node 18+)

const BASE_URL = 'http://localhost:5000/api';

async function testComments() {
    try {
        console.log('--- Authenticating ---');
        // 1. Login
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        const cookie = loginRes.headers.get('set-cookie');

        if (!token) throw new Error('Authentication failed');

        const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cookie': cookie || ''
        };

        // Reuse previous project/task or create new ones? Let's create new to be safe.
        console.log('\n--- Creating Project & Task ---');
        const createProjectRes = await fetch(`${BASE_URL}/projects`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ title: 'Comment Test Project', description: 'Testing comments' })
        });
        const projectData = await createProjectRes.json();
        const projectId = projectData.data._id;

        const createTaskRes = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ title: 'Commentable Task', priority: 'Low' })
        });
        const taskData = await createTaskRes.json();
        const taskId = taskData.data._id;
        console.log('Task ID:', taskId);

        console.log('\n--- Adding Comment ---');
        // 2. Add Comment
        const addCommentRes = await fetch(`${BASE_URL}/tasks/${taskId}/comments`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                text: 'This is a test comment 🚀'
            })
        });
        const addCommentData = await addCommentRes.json();
        console.log('Add Comment Status:', addCommentRes.status);
        console.log('Comment Text:', addCommentData.data?.text);

        if (!addCommentData.success) throw new Error('Add Comment failed');
        const commentId = addCommentData.data._id;

        console.log('\n--- Getting Comments ---');
        // 3. Get Comments
        const getCommentsRes = await fetch(`${BASE_URL}/tasks/${taskId}/comments`, {
            method: 'GET',
            headers: authHeaders
        });
        const getCommentsData = await getCommentsRes.json();
        console.log('Get Comments Status:', getCommentsRes.status);
        console.log('Comments Count:', getCommentsData.count);

        if (!getCommentsData.success) throw new Error('Get Comments failed');

        console.log('\n--- Deleting Comment ---');
        // 4. Delete Comment
        const deleteCommentRes = await fetch(`${BASE_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: authHeaders
        });
        const deleteCommentData = await deleteCommentRes.json();
        console.log('Delete Comment Status:', deleteCommentRes.status);

        if (!deleteCommentData.success) throw new Error('Delete Comment failed');

        console.log('\n✅ ALL COMMENT TESTS PASSED');

    } catch (err) {
        console.error('\n❌ TEST FAILED:', err.message);
    }
}

testComments();
