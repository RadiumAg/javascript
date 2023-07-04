def 创建和使用字典():
    phonebook = {'Alice':'2341','Beth':'9102','Cecil':'3258'}
    
    ## 元组
    items =[('name','Gumby') , ('age', 32)]
    d = dict(items)
    print(d)
    x = {}
    x[42] = 'Foobar'
    print(x)

创建和使用字典() 


def 将字符串格式设置功能用于字典():
    phonebook = {'Beth': '9102', 'Alice':'2341', 'Cecil':'3258'}
    "Cecil's phone number is {Ceil}".format_map(phonebook)