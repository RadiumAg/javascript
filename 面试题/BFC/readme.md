## 解决层叠上下文

1. 使用inline-block创建ifc
   
   ```typescript
   <div style="display:inline-block;margin-bottom:20px;"></div>
   <div style="display:inline-block;margin-top:20px;"></div>
   ```

2. 使用bfc
  ```typescript
   <div style="display:block;margin-bottom:20px;"></div>
   <div style="display:inline-block;margin-top:20px;"></div>
   ```