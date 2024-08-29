var cows = new List<Cow>();
// 协变
class 协变
{

  class Animal { }

  class Cow : Animal
  {
    public string Name { get; set; }

    public Cow(string name) : base()
    {
      this.Name = name;
    }

  }

  class SuperCow : Animal
  {
    public string Name { get; set; }

    public SuperCow(string name) : base()
    {
      this.Name = name;
    }

  }
  static Main()
  {
    var cows = new List<Cow>();
  }
}
