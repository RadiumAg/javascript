def simple():
    print([x * x for x in range(10)])
    print([x * x for x in range(10) if x % 3 == 0])
    print([(x, y) for x in range(3) for y in range(3)])
    girls = ["alice", "bernice"]
    boys = ["chris", "arnold", "bob"]
    print([b + "+" + g for b in boys for g in girls if b[0] == g[0]])

    squares = {i: "{} squared is {}".format(i, i * 2) for i in range(10)}


simple()


def 三人行():
    name = 1
    if name == "a":
        pass

    exec("print('Hello,world!')")


三人行()
