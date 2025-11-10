/**
 * Phase 3.1 最终验证脚本
 * 验证所有4个artworks的对话消息都有知识库引用
 */

const fs = require('fs');
const path = require('path');

// 读取所有对话文件
const dialogueFiles = [
  'artwork-1.js',
  'artwork-2.js',
  'artwork-3.js',
  'artwork-4.js'
];

let totalMessages = 0;
let messagesWithRefs = 0;
let totalReferences = 0;
const results = [];

console.log('\n=== Phase 3.1 Knowledge Base References 验证 ===\n');

dialogueFiles.forEach((filename, index) => {
  const artworkNum = index + 1;
  const filePath = path.join(__dirname, '..', 'js', 'data', 'dialogues', filename);

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // 统计消息数量（查找 id: "msg-" 模式）
    const messageMatches = content.match(/id:\s*["']msg-artwork-\d+-\d+-\d+["']/g) || [];
    const messageCount = messageMatches.length;

    // 统计有引用的消息（查找 references: [ 模式）
    const refMatches = content.match(/references:\s*\[/g) || [];
    const refCount = refMatches.length;

    // 统计总引用数（查找 critic: 模式在 references 数组内）
    const criticMatches = content.match(/critic:\s*["'][^"']+["']/g) || [];
    const totalRefs = criticMatches.length;

    totalMessages += messageCount;
    messagesWithRefs += refCount;
    totalReferences += totalRefs;

    const coverage = messageCount > 0 ? (refCount / messageCount * 100).toFixed(1) : 0;
    const avgRefs = refCount > 0 ? (totalRefs / refCount).toFixed(1) : 0;

    results.push({
      artwork: `Artwork ${artworkNum}`,
      messages: messageCount,
      withRefs: refCount,
      coverage: `${coverage}%`,
      totalRefs: totalRefs,
      avgRefs: avgRefs,
      status: refCount === messageCount ? '✅' : '⚠️'
    });

    console.log(`Artwork ${artworkNum}:`);
    console.log(`  消息总数: ${messageCount}`);
    console.log(`  有引用的消息: ${refCount}`);
    console.log(`  覆盖率: ${coverage}%`);
    console.log(`  总引用数: ${totalRefs}`);
    console.log(`  平均引用/消息: ${avgRefs}`);
    console.log(`  状态: ${refCount === messageCount ? '✅ 完成' : '⚠️ 未完成'}`);
    console.log();

  } catch (error) {
    console.error(`❌ 读取 ${filename} 失败:`, error.message);
  }
});

console.log('=== 总体统计 ===\n');
console.log(`总消息数: ${totalMessages}`);
console.log(`有引用的消息: ${messagesWithRefs}`);
console.log(`总引用数: ${totalReferences}`);
console.log(`整体覆盖率: ${(messagesWithRefs / totalMessages * 100).toFixed(1)}%`);
console.log(`平均引用/消息: ${(totalReferences / messagesWithRefs).toFixed(1)}`);
console.log();

// 创建总结表格
console.log('=== 总结表格 ===\n');
console.log('| Artwork | 消息数 | 有引用 | 覆盖率 | 总引用 | 平均引用/消息 | 状态 |');
console.log('|---------|--------|--------|--------|--------|---------------|------|');
results.forEach(r => {
  console.log(`| ${r.artwork} | ${r.messages} | ${r.withRefs} | ${r.coverage} | ${r.totalRefs} | ${r.avgRefs} | ${r.status} |`);
});
console.log();

// 验证结果
const allComplete = messagesWithRefs === totalMessages;
if (allComplete) {
  console.log('🎉 验证通过！所有消息都有知识库引用！');
  console.log(`✅ Phase 3.1 完成: ${totalMessages}条消息, ${totalReferences}个引用`);
} else {
  console.log(`⚠️ 还有 ${totalMessages - messagesWithRefs} 条消息未添加引用`);
}

process.exit(allComplete ? 0 : 1);
