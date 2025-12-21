const templatesGrid = document.getElementById('templatesGrid');
const editField = document.getElementById('editField');
const addTextBtn = document.getElementById('addTextBtn');
const addImageBtn = document.getElementById('addImageBtn');
const fontSelect = document.getElementById('fontSelect');
const textColor = document.getElementById('textColor');
const fontSizeInput = document.getElementById('fontSize');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const brushBtn = document.getElementById('brushBtn');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPanel = document.getElementById('emojiPanel');
const textSettings = document.getElementById('textSettings');

// Undo/Redo
let history = [];
let historyIndex = -1;
function saveHistory() {
  history = history.slice(0, historyIndex + 1);
  history.push(editField.innerHTML);
  historyIndex++;
}
function undo() {
  if(historyIndex>0){ historyIndex--; editField.innerHTML=history[historyIndex]; attachDraggables(); }
}
function redo() {
  if(historyIndex<history.length-1){ historyIndex++; editField.innerHTML=history[historyIndex]; attachDraggables(); }
}
undoBtn.onclick = undo;
redoBtn.onclick = redo;

// Шаблони
const templates = ['Футболка','Чашка','Постер','Сумка','Кепка','Подушка'];
templates.forEach(t=>{
  const btn=document.createElement('div'); btn.className='template-btn'; btn.textContent=t;
  btn.onclick = ()=>{
    editField.innerHTML = `<img src="images/${t}.png" style="position:absolute;top:0;left:0;width:100%;height:100%;">`;
    saveHistory();
  };
  templatesGrid.appendChild(btn);
});

// Додати текст
addTextBtn.onclick=()=>{
  textSettings.classList.toggle('hidden');
};
fontSelect.onchange = textColor.onchange = fontSizeInput.onchange = ()=>{
  // Необхідно застосовувати під час додавання тексту
}

// Додати текст + відкрити налаштування
addTextBtn.onclick = () => {
  // Створюємо текстовий блок
  const div = document.createElement('div');
  div.contentEditable = true;
  div.textContent = 'Текст';
  div.style.position = 'absolute';
  div.style.left = '10px';
  div.style.top = '10px';
  div.style.fontFamily = fontSelect.value;
  div.style.color = textColor.value;
  div.style.fontSize = fontSizeInput.value + 'px';
  div.classList.add('draggable');
  editField.appendChild(div);

  // Робимо його перетягуваним і масштабованим
  makeInteractive(div);

  // Зберігаємо стан
  saveHistory();

  // Відкриваємо панель налаштувань тексту
  textSettings.classList.remove('hidden');
};


// Додати картинку
addImageBtn.onclick=()=>{
  const input=document.createElement('input'); input.type='file'; input.accept='image/*';
  input.click();
  input.onchange=()=>{
    const file=input.files[0]; const reader=new FileReader();
    reader.onload=e=>{
      const img=document.createElement('img');
      img.src=e.target.result;
      img.style.position='absolute'; img.style.left='10px'; img.style.top='10px';
      img.style.width='150px'; img.style.height='150px';
      img.classList.add('draggable');
      editField.appendChild(img);
      makeInteractive(img);
      saveHistory();
    };
    reader.readAsDataURL(file);
  };
};

// Емодзі
const emojiList = ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍"];
emojiBtn.onclick=()=> emojiPanel.classList.toggle('hidden');
emojiList.forEach(e=>{
  const b=document.createElement('button'); b.textContent=e;
  b.onclick=()=>{
    const div=document.createElement('div');
    div.textContent=e; div.style.position='absolute'; div.style.left='10px'; div.style.top='10px';
    div.style.fontSize='32px'; div.classList.add('draggable');
    editField.appendChild(div);
    makeInteractive(div);
    saveHistory();
  };
  emojiPanel.appendChild(b);
});

// Drag & Resize
function makeInteractive(el){ enableDrag(el); enableResize(el); }

function enableDrag(el){
  let isDragging=false,startX,startY,startL,startT;
  el.onmousedown = e=>{
    if(e.target.classList.contains('resizer')) return;
    isDragging=true;
    startX=e.clientX; startY=e.clientY;
    startL=parseFloat(el.style.left||0); startT=parseFloat(el.style.top||0);
    e.preventDefault();
  };
  document.onmousemove=e=>{
    if(isDragging){
      let dx=e.clientX-startX, dy=e.clientY-startY;
      el.style.left=Math.max(0,Math.min(startL+dx,editField.offsetWidth-el.offsetWidth))+'px';
      el.style.top=Math.max(0,Math.min(startT+dy,editField.offsetHeight-el.offsetHeight))+'px';
    }
  };
  document.onmouseup=e=>{
    if(isDragging){ isDragging=false; saveHistory(); }
  };
}

function enableResize(el){
  const resizers=['nw','ne','sw','se','n','s','e','w'];
  resizers.forEach(pos=>{
    const r=document.createElement('div'); r.className='resizer '+pos; el.appendChild(r);
    let startX,startY,startW,startH,startL,startT;
    r.onmousedown=e=>{
      e.stopPropagation();
      startX=e.clientX; startY=e.clientY;
      startW=el.offsetWidth; startH=el.offsetHeight;
      startL=parseFloat(el.style.left||0); startT=parseFloat(el.style.top||0);
      function onMove(e2){
        let dx=e2.clientX-startX, dy=e2.clientY-startY;
        let newW=startW,newH=startH,newL=startL,newT=startT;
        if(pos.includes('e')) newW=startW+dx;
        if(pos.includes('s')) newH=startH+dy;
        if(pos.includes('w')) { newW=startW-dx; newL=startL+dx; }
        if(pos.includes('n')) { newH=startH-dy; newT=startT+dy; }
        if(newL<0){ newW+=newL; newL=0; }
        if(newT<0){ newH+=newT; newT=0; }
        if(newL+newW>editField.offsetWidth) newW=editField.offsetWidth-newL;
        if(newT+newH>editField.offsetHeight) newH=editField.offsetHeight-newT;
        el.style.width=newW+'px'; el.style.height=newH+'px'; el.style.left=newL+'px'; el.style.top=newT+'px';
      }
      function onUp(){ document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); saveHistory(); }
      document.addEventListener('mousemove',onMove); document.addEventListener('mouseup',onUp);
    };
  });
}

// Attach draggables після undo/redo
function attachDraggables(){
  Array.from(editField.children).forEach(c=>{ if(c.classList.contains('draggable')) makeInteractive(c); });
}

// Кисть
let painting=false, brushCanvas=null;
brushBtn.onclick=()=>{
  if(!brushCanvas){
    brushCanvas=document.createElement('canvas');
    brushCanvas.width=editField.offsetWidth; brushCanvas.height=editField.offsetHeight;
    brushCanvas.style.position='absolute'; brushCanvas.style.top=0; brushCanvas.style.left=0; brushCanvas.style.zIndex=100;
    editField.appendChild(brushCanvas);
  }
  const ctx=brushCanvas.getContext('2d'); ctx.strokeStyle='#000'; ctx.lineWidth=3;
  brushCanvas.onmousedown=e=>{ painting=true; ctx.beginPath(); ctx.moveTo(e.offsetX,e.offsetY); };
  brushCanvas.onmousemove=e=>{ if(painting){ ctx.lineTo(e.offsetX,e.offsetY); ctx.stroke(); } };
  brushCanvas.onmouseup=e=>{ if(painting){ painting=false; saveHistory(); } };
};
