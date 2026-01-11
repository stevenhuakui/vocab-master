import { parseVocabulary } from '../src/utils/parser';

const sampleText = `
1 abandon
n放弃、放纵 n放弃、遗弃、沉湎于
Their decision to abandon the trip was made because of financial 
Constraints.他们决定放弃这次出游是因为财力有限。
第三人称单数abandons
过去式abandoned

2 able
(1)能够 unble不能够
词组：be able to do sth
（2）聪明的，伶俐的

22 accuse[əˈkjuːz
vt:指责;控告;谴责;控诉
例句
I hate it when people accuse us of that
我讨厌别人就那件事指责我们。
`;

const result = parseVocabulary(sampleText);
console.log(JSON.stringify(result, null, 2));

if (result.length === 3 && result[0].word === 'abandon' && result[2].word === 'accuse') {
    console.log("TEST PASSED");
} else {
    console.log("TEST FAILED");
}
