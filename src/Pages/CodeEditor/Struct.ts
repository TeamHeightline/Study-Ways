
export const oldCode = `<!DOCTYPE html>
<html lang="en">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>
body {font-family: "Lato", sans-serif;}
.mySlides {display: none}
</style>
<body>
<div class="w3-content" 
style="
max-width:2000px;
margin-top:46px">
  <div class="w3-container w3-content w3-center w3-padding-64" style="max-width:800px" id="band">
    <h2 class="w3-wide">РЕДАКТОР HTML</h2>
    <p class="w3-opacity"><i>Создано в Герцена</i></p>
    <p class="w3-justify">
    Этот редактор создан студентом второго курса ИВТ Герцена Чирцовом Тимофеем, в основе него лежит простая библиотека для редакторов и мощь React, верстка сделана на Material ui Grid, рендер происходит через dangerouslySetInnerHTML, редактор создан за час, за идейную основу был взят Кодактор, за основу дизайна главной странице взят открытый шаблон с w3schools.com    
    </p>
  </div>
  <div class="w3-container w3-content w3-padding-64" style="max-width:800px" id="contact">
    <h2 class="w3-wide w3-center">КОНТАКТЫ</h2>
    <p class="w3-opacity w3-center"><i>Есть вопросы - пишите</i></p>
    <div class="w3-row ">
      <div class="w3-col m6 w3-large w3-margin-bottom">
        <i class="fa fa-map-marker" style="width:30px"></i> Санкт-Петербург, Герцена<br>
        <i class="fa fa-phone" style="width:30px"></i>8-911-137-65-51<br>
        <i class="fa fa-envelope" style="width:30px"> </i>teamheightline@mail.ru<br>
      </div>
    </div>
  </div>
</div>
</body>
</html>`
export const oldCode2=`
<html>
 <head><title>ReactLearn</title>
   <script src="https://unpkg.com/@babel/standalone/babel.js"></script> 
   <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"></script>
 </head>
 <body>
    <div class="cont"></div>
    <script>
      var [{ render: r }, { Component: C, useState }] = [ReactDOM, React]; 
      var a = ['z', 'b', 'a'];
    </script>
    <script type="text/babel">
     
     const List = props => {
       const [arr, setArr] = useState(a);
       return <>
         <button onClick={() => setArr([...a].sort())}>sort</button>
         { arr.map(x => <p>{x}</p>) }
       </>;  
     };  
     
     r(<List/>, document.querySelector('.cont'));
    </script>
 </body>
</html>`
