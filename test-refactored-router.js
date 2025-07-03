import Router from './src/common/router/index.js';

console.log('=== 리팩터링된 Router 테스트 ===\n');

// 테스트용 라우터 생성
const testRouter = new Router();

// 다양한 라우트 패턴 추가
testRouter.get('/users', (req, res) => {
    res.writeHead(200);
    res.end('All users');
});

testRouter.get('/users/:id', (req, res) => {
    res.writeHead(200);
    res.end(`User ID: ${req.params.id}`);
});

testRouter.get('/users/:id/posts/:postId', (req, res) => {
    res.writeHead(200);
    res.end(`User ${req.params.id}, Post ${req.params.postId}`);
});

testRouter.post('/users/:id/comments', (req, res) => {
    res.writeHead(201);
    res.end(`Comment created for user ${req.params.id}`);
});

// 메인 라우터에 등록
const mainRouter = new Router();
mainRouter.setGlobalPrefixPath('/api');
mainRouter.use(testRouter);

console.log('등록된 라우트들:');
console.log('GET 라우트:', Array.from(mainRouter.routes.GET.keys()));
console.log('POST 라우트:', Array.from(mainRouter.routes.POST.keys()));

// 라우트 매칭 테스트
const testCases = [
    { method: 'GET', path: '/api/users', expected: 'match' },
    { method: 'GET', path: '/api/users/123', expected: 'match with params: {id: "123"}' },
    { method: 'GET', path: '/api/users/456/posts/789', expected: 'match with params: {id: "456", postId: "789"}' },
    { method: 'POST', path: '/api/users/999/comments', expected: 'match with params: {id: "999"}' },
    { method: 'GET', path: '/api/nonexistent', expected: 'no match' },
    { method: 'DELETE', path: '/api/users/123', expected: 'method not allowed' }
];

console.log('\n=== 라우트 매칭 테스트 ===');

testCases.forEach((testCase, index) => {
    try {
        const result = mainRouter.searchRoute(testCase.method, testCase.path);

        if (result) {
            const paramsStr =
                Object.keys(result.params).length > 0 ? ` with params: ${JSON.stringify(result.params)}` : '';
            console.log(`테스트 ${index + 1}: ✅ 매칭됨${paramsStr}`);
            console.log(`  ${testCase.method} ${testCase.path}`);
        } else {
            console.log(`테스트 ${index + 1}: ❌ 매칭되지 않음`);
            console.log(`  ${testCase.method} ${testCase.path}`);
        }
    } catch (error) {
        console.log(`테스트 ${index + 1}: ⚠️  에러 - ${error.message}`);
        console.log(`  ${testCase.method} ${testCase.path}`);
    }
    console.log();
});

console.log('테스트 완료!');
