
from typing import List

class Solution:
    def maxProfit(self, k: int, prices: List[int]) -> int:
        max_txn = k
        n = len(prices)
        # dp[t][d] = max profit with at most t transactions by day d
        # t ∈ [0..2] (number of transactions)
        # d ∈ [0..n-1] (days)
        dp = [[0] * n for _ in range(max_txn + 1)]

        for t in range(1, max_txn+1):
            max_profit_so_far = -prices[0]
            for d in range(1, n):
                # Option 1: don't sell today, carry forward previous max
                # Option 2: sell today, and find best buy day using max_so_far
                dp[t][d] = max(dp[t][d-1], prices[d] + max_profit_so_far)
                # Update max_so_far for future days
                max_profit_so_far = max(max_profit_so_far, dp[t-1][d] - prices[d])
        # last day upto max_txn 
        return dp[max_txn][n-1]