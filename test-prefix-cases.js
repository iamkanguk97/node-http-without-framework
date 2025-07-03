import Router from './src/common/router/index.js';

console.log('=== Router Prefix 테스트 ===\n');

// 테스트 케이스들
const testCases = [
    // 유효한 경우들
    { prefix: 'users', path: '/list', expected: '/users/list' },
    { prefix: 'users/', path: '/list', expected: '/users/list' },
    { prefix: '/users', path: '/list', expected: '/users/list' },
    { prefix: '/users/', path: '/list', expected: '/users/list' },
    { prefix: 'api', path: 'users', expected: '/api/users' },
    { prefix: '/api/', path: 'users', expected: '/api/users' },

    // 무효한 경우들 (prefix가 적용되지 않아야 함)
    { prefix: '', path: '/list', expected: '/list' },
    { prefix: '   ', path: '/list', expected: '/list' },
    { prefix: '//users', path: '/list', expected: '/list' },
    { prefix: 'users//api', path: '/list', expected: '/list' },
    { prefix: 'users@api', path: '/list', expected: '/list' }
];

testCases.forEach((testCase, index) => {
    const router = new Router({ prefix: testCase.prefix });
    const result = router.getCombinedWithPrefix(testCase.path);
    const isValid = router.isValidPrefix(testCase.prefix);

    const status = result === testCase.expected ? '✅' : '❌';

    console.log(`테스트 ${index + 1}: ${status}`);
    console.log(`  prefix: "${testCase.prefix}"`);
    console.log(`  path: "${testCase.path}"`);
    console.log(`  예상: "${testCase.expected}"`);
    console.log(`  결과: "${result}"`);
    console.log(`  prefix 유효성: ${isValid}`);
    console.log('');
});

console.log('=== 실제 Router 사용 예시 ===\n');

// 실제 사용 예시
const userRouter = new Router({ prefix: '/users' });
userRouter.get('/list', (req, res) => {
    res.writeHead(200);
    res.end('User list');
});

const apiRouter = new Router({ prefix: 'api/' });
apiRouter.get('/status', (req, res) => {
    res.writeHead(200);
    res.end('API status');
});

console.log('User Router에 등록된 경로들:');
console.log('GET:', Array.from(userRouter.pendingRoutes.GET.map((route) => route.path)));

console.log('\nAPI Router에 등록된 경로들:');
console.log('GET:', Array.from(apiRouter.pendingRoutes.GET.map((route) => route.path)));

console.log('\n테스트 완료!');
