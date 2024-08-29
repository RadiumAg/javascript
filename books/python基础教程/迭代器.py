class Fibs:
    def __init__(self):
        self.a = 0
        self.b = 1

    def __next__(self):
        self.a, self.b = self.b, self.a + self.b
        return self.a

    def __iter__(self):
        return self


def 迭代器():
    fibs = Fibs()
    for f in fibs:
        if f > 1000:
            print(f)
            break


迭代器()


def 从迭代器创建序列():
    class TestIterator:
        value = 0

        def __next__(self):
            self.value += 1
            if self.value > 10:
                raise StopIteration
            return self.value

        def __iter__(self):
            return self

    ti = TestIterator()
    print(list(ti))


从迭代器创建序列()


def 生成器():
    def flatten(nested):
        for sublist in nested:
            for element in sublist:
                yield element

    nested = [[1, 2], [3, 4], [5]]

    for num in flatten(nested):
        print(num)


生成器()
