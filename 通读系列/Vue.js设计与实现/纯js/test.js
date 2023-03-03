import { reactive } from './effect.js';

const obj = {};
const testObj = reactive([obj]);

testObj.includes(1);
