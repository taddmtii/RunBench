import "dotenv/config";
import pg from "pg";

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;
if (!connectionString) {
  throw new Error("Set DATABASE_URL or DIRECT_URL in frontend/.env");
}

const stubsById = {
  "0d2ad4ef-6de1-4696-899c-72fa7ba37964": {
    cpp: `bool ContainsDuplicate(vector<int>& nums) {
    // Enter code here
}`,
    csharp: `public bool ContainsDuplicate(int[] nums) {
    // Enter code here
}`,
    python: `def contains_duplicate(nums: List[int]) -> bool:
    # Enter code here`,
    javascript: `function ContainsDuplicate(nums) {
  // Enter code here
}

module.exports = { contains_duplicate: ContainsDuplicate };`,
    typescript: `function ContainsDuplicate(nums: number[]): boolean {
  // Enter code here
}

export { ContainsDuplicate as contains_duplicate };`,
  },
  "1258f13f-efd8-47ee-a543-84237238b8d3": {
    cpp: `bool isAnagram(string s, string t) {
    // Enter code here
}`,
    csharp: `public bool IsAnagram(string s, string t) {
    // Enter code here
}`,
    python: `def is_anagram(s: str, t: str) -> bool:
    # Enter code here`,
    javascript: `function isAnagram(s, t) {
  // Enter code here
}

module.exports = { is_anagram: isAnagram };`,
    typescript: `function isAnagram(s: string, t: string): boolean {
  // Enter code here
}

export { isAnagram as is_anagram };`,
  },
  "56ed316d-a727-42c0-9610-f953fff90da6": {
    cpp: `bool isValid(string s) {
    // Enter code here
}`,
    csharp: `public bool IsValid(string s) {
    // Enter code here
}`,
    python: `def is_valid(s: str) -> bool:
    # Enter code here`,
    javascript: `function isValid(s) {
  // Enter code here
}

module.exports = { is_valid: isValid };`,
    typescript: `function isValid(s: string): boolean {
  // Enter code here
}

export { isValid as is_valid };`,
  },
  "a0668057-169e-49c2-ba24-5780f5730f66": {
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Enter code here
}`,
    csharp: `public int[] TwoSum(int[] nums, int target) {
    // Enter code here
}`,
    python: `def two_sum(nums: List[int], target: int) -> List[int]:
    # Enter code here`,
    javascript: `function twoSum(nums, target) {
  // Enter code here
}

module.exports = { two_sum: twoSum };`,
    typescript: `function twoSum(nums: number[], target: number): number[] {
  // Enter code here
}

export { twoSum as two_sum };`,
  },
  "fb721186-8906-42ee-9727-475322f45b71": {
    cpp: `int maxProfit(vector<int>& prices) {
    // Enter code here
}`,
    csharp: `public int MaxProfit(int[] prices) {
    // Enter code here
}`,
    python: `def max_profit(prices: List[int]) -> int:
    # Enter code here`,
    javascript: `function maxProfit(prices) {
  // Enter code here
}

module.exports = { max_profit: maxProfit };`,
    typescript: `function maxProfit(prices: number[]): number {
  // Enter code here
}

export { maxProfit as max_profit };`,
  },
};

const client = new pg.Client({ connectionString });
await client.connect();

for (const [id, functionStubs] of Object.entries(stubsById)) {
  const result = await client.query(
    `UPDATE problems SET "functionStubs" = $1::jsonb WHERE id = $2`,
    [JSON.stringify(functionStubs), id],
  );
  console.log(`${id}: ${result.rowCount} row(s) updated`);
}

await client.end();
