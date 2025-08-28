// 测试运行器
console.log('🚀 开始运行简易React测试套件\\n');

async function runTests() {
  const tests = [
    './basic-api.test.js',
    './dom-rendering.test.js'
  ];

  let passedCount = 0;
  let failedCount = 0;

  for (const testFile of tests) {
    console.log(`📁 运行测试文件: ${testFile}`);
    console.log('='.repeat(50));
    
    try {
      const testModule = await import(testFile);
      
      if (testModule.default && testModule.default.passed) {
        console.log(`✅ ${testFile}: ${testModule.default.message}`);
        passedCount++;
      } else {
        console.log(`❌ ${testFile}: 测试失败`);
        failedCount++;
      }
    } catch (error) {
      console.error(`❌ ${testFile}: 运行错误 -`, error);
      failedCount++;
    }
    
    console.log('='.repeat(50));
    console.log('');
  }

  // 测试总结
  console.log('📊 测试总结');
  console.log('-'.repeat(30));
  console.log(`✅ 通过: ${passedCount} 个测试文件`);
  console.log(`❌ 失败: ${failedCount} 个测试文件`);
  console.log(`📄 总计: ${passedCount + failedCount} 个测试文件`);
  
  if (failedCount === 0) {
    console.log('\\n🎉 所有测试都通过了！我们的简易React实现基本功能正常！');
    return true;
  } else {
    console.log('\\n⚠️  有一些测试失败，需要进一步调试。');
    return false;
  }
}

// 运行测试
runTests().then(success => {
  if (success) {
    console.log('\\n✨ 简易React实现验证完成！');
    console.log('\\n主要实现的功能：');
    console.log('  - ✅ 核心React API (createElement, Component, Hooks)');
    console.log('  - ✅ Fiber架构');
    console.log('  - ✅ 调度器 (Scheduler) 和并发特性');
    console.log('  - ✅ Hooks系统 (useState, useEffect, useCallback等)');
    console.log('  - ✅ startTransition 并发特性');
    console.log('  - ✅ ReactDOM渲染器');
    console.log('  - ✅ 协调算法 (Reconciler)');
    console.log('\\n🚀 可以开始使用这个简易版React了！');
  } else {
    process.exit(1);
  }
}).catch(error => {
  console.error('测试运行失败:', error);
  process.exit(1);
});