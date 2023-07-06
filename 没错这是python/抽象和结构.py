def combine(parameter):
    print(parameter + globals().get("parameter"))


parameter = "berry"
combine("Shrub")


x = 1


def change_global():
    global x
    x = x + 1


change_global()
