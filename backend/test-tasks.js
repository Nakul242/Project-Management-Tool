// Using native fetch (Node 18+)

const BASE_URL = 'http://localhost:5000/api';

async function testTaskCRUD() {
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

        console.log('\n--- Creating Project for Tasks ---');
        // 2. Create Project
        const createProjectRes = await fetch(`${BASE_URL}/projects`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Task Project ' + Date.now(),
                description: 'Project to test tasks'
            })
        });
        const createProjectData = await createProjectRes.json();
        const projectId = createProjectData.data._id;
        console.log('Project ID:', projectId);

        if (!projectId) throw new Error('Failed to create project');

        console.log('\n--- Creating Task ---');
        // 3. Create Task
        const createTaskRes = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Test Task 1',
                description: 'First task',
                priority: 'High'
            })
        });
        const createTaskData = await createTaskRes.json();
        console.log('Create Task Status:', createTaskRes.status);
        console.log('Task Title:', createTaskData.data?.title);

        if (!createTaskData.success) throw new Error('Create Task failed ' + JSON.stringify(createTaskData));
        const taskId = createTaskData.data._id;

        console.log('\n--- Getting Tasks ---');
        // 4. Get Tasks
        const getTasksRes = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
            method: 'GET',
            headers: authHeaders
        });
        const getTasksData = await getTasksRes.json();
        console.log('Get Tasks Status:', getTasksRes.status);
        console.log('Tasks Count:', getTasksData.count);

        if (!getTasksData.success) throw new Error('Get Tasks failed');

        console.log('\n--- Updating Task Status ---');
        // 5. Update Task
        const updateTaskRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                status: 'In Progress'
            })
        });
        const updateTaskData = await updateTaskRes.json();
        console.log('Update Task Status:', updateTaskRes.status);
        console.log('New Status:', updateTaskData.data?.status);

        if (!updateTaskData.success) throw new Error('Update Task failed');

        console.log('\n--- Deleting Task ---');
        // 6. Delete Task
        const deleteTaskRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: authHeaders
        });
        const deleteTaskData = await deleteTaskRes.json();
        console.log('Delete Task Status:', deleteTaskRes.status);

        if (!deleteTaskData.success) throw new Error('Delete Task failed');

        console.log('\n✅ ALL TASK TESTS PASSED');

    } catch (err) {
        console.error('\n❌ TEST FAILED:', err.message);
    }
}

testTaskCRUD();
