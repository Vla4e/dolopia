// helper.js
export function startDrag(event, isDragging, startY) {
  console.log("Is dragging", isDragging)
  isDragging.value = true;
  startY.value = event.type.includes('mouse')
    ? event.clientY
    : event.touches[0].clientY;
}

export function onDrag(event, isDragging, startY, deltaY) {
  if (!isDragging.value) return;
  event.preventDefault();
  const currentY = event.type.includes('mouse')
    ? event.clientY
    : event.touches[0].clientY;
  deltaY.value = currentY - startY.value;
}

export function endDrag(isDragging, deltaY) {
  if (!isDragging.value) return;
  isDragging.value = false;
  deltaY.value = 0;
}
