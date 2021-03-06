  let rawData = [...document.querySelectorAll('#checkboxes input')].map(cb => 
     ({ value: +cb.getAttribute('val'), selected: cb.checked }));

  // базовый размер и время анимации
  let size = 400, time = 500; 
  
  // цветовая шкала 
  // (функция которая принимает на вход число и возвращает цвет, тут их 10)
  let colors = d3.scaleOrdinal(d3.schemeCategory10);

  // чекбоксы
  d3.select('#checkboxes').selectAll('label').data(rawData)
    .style('background-color', (d, i) => colors(i))
    
  d3.select('#checkboxes').selectAll('input').data(rawData)  
    .on("change", function (d) { 
      update(d.selected = this.checked); 
    });

  // добавим svg
  let svg = d3.select('#donut').append("svg").attr("height", size)
              .attr("viewBox", `-${size} -${size/2} ${size*2} ${size}`);

  // инициализируем генератор данных для передачи в генератор arc()
  let pie = d3.pie().value(d => d.selected ? d.value : 0).sort(null);

  let pieData = pie(rawData);

  // инициализируем генератор дуг для секторов
  let arc = d3.arc().innerRadius(size/3.1-30).outerRadius(size/3.1);

  // инициализируем генератор дуг для подсчета линий подписей
  let arc2 = d3.arc().innerRadius(size/2.7).outerRadius(size/2.7);

  // инициализируем генератор дуг для подсчета центров текста подписей
  let arc3 = d3.arc().innerRadius(size/2.2).outerRadius(size/2.2);

  // инициализируем генератор линий
  let line = d3.line();

  // создаем выборку (групп) элементов и привязываем к ней данные
  let groups = svg.selectAll("g").data(rawData)
                  .enter().append("g").attr('opacity', (d,i) => pieData[i].value);

  // добавляем пути для секторов в группы, 
  // данные привязанные к группам тут нам достаются по наследству
  let sectors = groups.data(pieData).append("path").classed("sector", true)
                      .attr("fill", (d, i) => colors(i));

  // пути для линий подписей
  let titlesPaths = groups.data(pieData).append("path").classed("label", true);

  // тексты подписей
  let titlesTexts = groups.data(pieData).append("text")
                          .text((d,i) => rawData[i].value);

  // текст в центре 
  let totalText = svg.append('text').style('font-size', 42).attr('y', 2);

  // начальная анимация путей секторов                 
  sectors.transition().duration(time).attrTween('d', growSectorsPaths); 

  // начальная анимация путей для подписей
  titlesPaths.transition().duration(time).attr('opacity', 1)
             .attrTween('d', growTitlesPaths); 

  // начальная анимация текста подписей
  titlesTexts.transition().duration(time)
          .attrTween("x", tweenTitlesTextsX)
          .attrTween("y", tweenTitlesTextsY);
          
  // начальная анимация текста по центру
  totalText.datum(calcTotal()).transition().duration(time)
           .tween("text", interpolateTotal)

  function update() {
      let d = pie(rawData);

      // задаем анимацию перехода путям секторов 
      sectors.data(d).transition().duration(time)
          .attrTween("d", tweenSectorsPaths);

      groups.data(d).transition().duration(time)
          .attr('opacity', d => d.value ? 1 : 0)

      // задаем анимацию перехода путям для подписей
      titlesPaths.data(d).transition().duration(time)
          .attrTween("d", tweenTitlesPaths);

      // задаем анимацию перехода путям для подписей
      titlesTexts.data(d).transition().duration(time)
          .attrTween("x", tweenTitlesTextsX)
          .attrTween("y", tweenTitlesTextsY);
          
      // анимация текста по центру
      totalText.datum(calcTotal()).transition().duration(time)
           .tween("text", interpolateTotal) 
  }

  function growTitlesPaths(d) {
      let i = d3.interpolate(size/4, size/2.7);
      return t => {
        let r = i(t);
        arc2.innerRadius(r).outerRadius(r);
        return line([arc.centroid(this._current = d),arc2.centroid(d)]);
      }
  }

  function growSectorsPaths(d) {
     let c = (d.startAngle+d.endAngle)/2;
     let il = d3.interpolate(c, d.startAngle);
     let ir = d3.interpolate(c, d.endAngle)
     return t => {
       d.startAngle = il(t);
       d.endAngle = ir(t);
       return arc(this._current = d);
     }; 
  }

  function tweenSectorsPaths(d) {
    let i = lerp(this, d);
    return t => arc(i(t));
  }

  function tweenTitlesPaths(d) {
    let i = lerp(this, d);
    return t => line([arc.centroid(i(t)), arc2.centroid(i(t))]);
  }

  function tweenTitlesTextsX(d) {
    let i = lerp(this, d, '_currentX');
    return t => arc3.centroid(i(t))[0];
  }

  function tweenTitlesTextsY(d) {
    let i = lerp(this, d, '_currentY');
    return t => arc3.centroid(i(t))[1];
  }

  function interpolateTotal(d) {
    let i = lerp(this, d);
    return t => Math.round(i(t));
  }

  function lerp(el, d, key){
    key = key || '_current';
    return d3.interpolate(el[key] || 0, el[key] = d);
  }

  function calcTotal() {
    return rawData.map(d => d.selected ? d.value : 0).reduce((a,v) => a + v, 0)
  }

  function interpolateTotal(d) {
    let that = d3.select(this);
    let i = lerp(this, d);
    return t => that.text(Math.floor(i(t)))
  }

  function showOrHide(bloggood, cat) {
    bloggood = document.getElementById(bloggood);
    cat = document.getElementById(cat);
    if (bloggood.checked) cat.style.display = "block";
    else cat.style.display = "none";
  }