// MARK: - 基础知识

func basicsExample() {
  let constVariable: Int = 0
  var changeVariable: Int = 0
  print(constVariable)

  var enviroment = "dev"
  let maxiumNumberOfLoginAttemps: Int
}

// MARK: - 闭包

func closureExample() {
  let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
  var reversedNames = names
}

// MARK: - 继承

func inheritanceExample() {
  class Vehicle {
    var currentSpeed = 0.0
    var description: String {
      return "traveling at \(currentSpeed) miles per hour"
    }

    func makeNoise() {}
  }

  let someVehicle = Vehicle()

  print("Vechicle: \(someVehicle.description)")
}

// MARK: - 执行

inheritanceExample()
