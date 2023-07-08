def raise语句():
    raise Exception


def 不用提供参数():
    class MuffedCalculator:
        muffled = False

        def calc(self, expr):
            try:
                return eval(expr)

            except ZeroDivisionError:
                if self.muffled:
                    print("Division by zero is illegal")
                else:
                    raise

    calculator = MuffedCalculator()
    calculator.calc("10 / 2")


不用提供参数()


def 不那么异常的情况():
    
