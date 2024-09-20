const content = (MiniReact.createElement("div", null,
    MiniReact.createElement("a", { href: "xxx" }, "link")));
console.log(JSON.stringify(content, null, 2));
