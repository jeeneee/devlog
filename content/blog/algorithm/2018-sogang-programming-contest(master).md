---
title: '2018 Sogang Programming Contest (Master)'
date: 2020-10-02 22:20:13
category: 'algorithm'
draft: false
---

- **[16561 3의 배수](https://www.acmicpc.net/problem/16561)**

  자연수 3개가 하나 이상의 3을 가질 수 있도록 조합을 계산하면 된다.

  ```python
  from math import factorial

  def nCr(n, r):
      return factorial(n) // (factorial(r) * factorial(n-r))

  n = int(input())
  if n < 9:
      print(0)
  else:
      print(nCr(n//3-1, 2))
  ```

- [**16562 친구비**](https://www.acmicpc.net/problem/16562)

  단순한 union-find문제이다. 비용이 작은 친구를 부모로 잡고 합치면 된다.

  ```python
  def find(u):
      if u == parent[u]:
          return u
      parent[u] = find(parent[u])
      return parent[u]

  def merge(u, v):
      u, v = find(u), find(v)
      if costs[u] > costs[v]:
          parent[u] = v
      else:
          parent[v] = u

  n, m, k = map(int, input().split())
  parent = list(i for i in range(n))
  costs = list(map(int, input().split()))
  for _ in range(m):
      u, v = map(int, input().split())
      u -= 1
      v -= 1
      if find(u) != find(v):
          merge(u, v)
  for i in range(n):
      parent[i] = find(i)
  total = 0
  for i in parent:
      total += costs[i]
      costs[i] = 0
  if total > k:
      print("Oh no")
  else:
      print(total)
  ```

- **[16563 어려운 소인수분해](https://www.acmicpc.net/problem/16563)**

  에라토스테네스의 체를 이용하되, 소수에 대한 단순 여부가 아닌 소수인 약수의 최소값을 저장해야 시간초과가 나지 않는다.

  ```python
  from math import sqrt
  import sys
  input = sys.stdin.readline
  MAX = 5000001

  minFactor = [i for i in range(MAX)]
  for i in range(2, int(sqrt(MAX)) + 1):
      if minFactor[i] == i:
          for j in range(i * i, MAX, i):
              if minFactor[j] == j:
                  minFactor[j] = i

  n = int(input())
  array = list(map(int, input().split()))
  for k in array:
      res = ''
      while k > 1:
          res += str(minFactor[k]) + ' '
          k = k // minFactor[k]
      print(res)
  ```

- [**16564 히오스 프로게이머**](https://www.acmicpc.net/problem/16564)

  단순한 이진 탐색 문제.

  ```python
  import sys
  input = sys.stdin.readline
  n, k = map(int, input().split())
  level = [int(input()) for _ in range(n)]
  level.sort()
  lo = min(level)
  hi = max(level) + k // n
  while lo <= hi:
      mid = (lo + hi) // 2
      total = 0
      for i in level:
          if i >= mid:
              break
          total += mid - i
      if total > k:
          hi = mid - 1
      else:
          lo = mid + 1
  print(hi)
  ```

- **[16565 N포커](https://www.acmicpc.net/problem/16565)**

  최대 13세트의 포카드가 나올 수 있는데, 이 과정에서 중복을 제거해야 한다.

  ```python
  from math import factorial

  def nCr(n, r):
      return factorial(n) // (factorial(n-r) * factorial(r))

  n = int(input())
  ans = 0
  temp = 1
  for i in range(4, n+1, 4):
      ans += temp * nCr(13, i // 4) * nCr(52 - i, n - i)
      temp *= -1
  print(ans % 10007)
  ```

- **[16566 카드 게임](https://www.acmicpc.net/problem/16566)**

  제곱근 분할법을 이용했다.

  ```python
  import sys
  from math import sqrt
  input = sys.stdin.readline
  output = sys.stdout.write

  # 제곱근 분할법
  def solve():
      n, _, _ = map(int, input().split())
      sqrt_n = int(sqrt(n))
      bucket = [0 for _ in range(sqrt_n + 1)]
      cnt = [0 for _ in range(n + 1)]
      temp = list(map(int, input().split()))
      for v in temp:
          bucket[v // sqrt_n] += 1
          cnt[v] += 1
      temp = list(map(int, input().split()))
      for a in temp:
          for j in range(a // sqrt_n, n // sqrt_n + 1):
              flag = False
              if bucket[j]:
                  for b in range(max(a+1, j * sqrt_n), (j+1) * sqrt_n + 1):
                      if cnt[b] > 0:
                          output(str(b) + '\n')
                          cnt[b] -= 1
                          bucket[j] -= 1
                          flag = True
                          break
              if flag:
                  break

  if __name__ == '__main__':
      solve()
  ```
