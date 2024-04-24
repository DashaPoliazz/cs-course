#Building heap up

The heap builds up with the **heapify-down** algorithm **(T -> O(Log(N)), S -> O(1))**.
It could be also builded with **heapify-up** but it will be much slower **(T -> O(N\*Log(N)), S -> O(1))**.

#Sorting

Sorting algorithm performs in-place sort. it's pretty simple. Firstly, we have take out the most prioritized element. Then we have to swap it with the last element in the lookup. After it, we have to maintain the weak-sort property. To do it, we must heapify swapped element down.
