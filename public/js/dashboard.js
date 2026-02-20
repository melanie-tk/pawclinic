function toggleEdit(userId) {
    const viewRow = document.getElementById('row-view-' + userId)
    const editRow = document.getElementById('row-edit-' + userId)
    
    editRow.classList.toggle('visible')
    viewRow.classList.toggle('editing')
}