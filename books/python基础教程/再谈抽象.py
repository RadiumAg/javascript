class Persion:
    def set_name(self, name):
        self.name = name
        self.__a

    def get_name(self):
        return self.name

    def greet(self):
        print("Hello,world!,i'm {}".format(self.name))

     __a = 1 ## 私有属性


class Filter:
    pass

class a(Filter):
    pass