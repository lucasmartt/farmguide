// ---------- FUNCTIONS ---------- //

const calculateFCM = () => {
    let formulaTotal = 0;
    let compostTotal = 0;
    let manureTotal = 0;

    turf.forEach(soilElement => {
        formulaTotal += Number(soilElement.getAttribute('data-f'));
        compostTotal += Number(soilElement.getAttribute('data-c'));
        manureTotal += Number(soilElement.getAttribute('data-m'));
    });

    const formulaSum = document.querySelector('#formula-sum')
    const compostSum = document.querySelector('#compost-sum')
    const manureSum = document.querySelector('#manure-sum')

    formulaSum.textContent = formulaTotal;
    compostSum.textContent = compostTotal;
    manureSum.textContent = manureTotal;

    formulaSum.style.color = getNumberColor(formulaTotal)
    compostSum.style.color = getNumberColor(compostTotal)
    manureSum.style.color = getNumberColor(manureTotal)
}

// ----------=---------=---------- //

const toggleInfo = (element) => {
    element.classList.toggle("--info");
}

// ----------=---------=---------- //

const swapAnimation = (cropplantedElement, swapToNone, animationElement, [firstAnimCrop, firstAnimName], [secondAnimCrop, secondAnimName] = ["", ""]) => {
    const firstAnimation = animationElement[firstAnimName] = {}
    const firstAnimResourses = resources[firstAnimCrop][firstAnimName]

    firstAnimation['id'] = findId(firstAnimCrop, firstAnimName)
    firstAnimResourses['playing'].push(firstAnimation['id'])
    cropplantedElement.setAttribute('src', `${dirAnim}${firstAnimResourses['src']}?${firstAnimation['id']}`)
    cropplantedElement.dataset.animation = firstAnimName

    if (swapToNone) {
        firstAnimation['timeoutElement'] = setTimeout(() => {
            cropplantedElement.setAttribute('src', "");
            cropplantedElement.dataset.animation = ""
            removeItemsByValue(firstAnimResourses['playing'], firstAnimation['id'])
        }, firstAnimResourses['duration'])
    } else {
        const secondAnimation = animationElement[secondAnimName] = {}
        const secondAnimResourses = resources[secondAnimCrop][secondAnimName]

        const loadAnim = document.createElement('img')
        loadAnim.style.position = 'absolute'
        loadAnim.style.display = 'none'
        bufferElement.appendChild(loadAnim)

        secondAnimation['id'] = findId(secondAnimCrop, secondAnimName)
        secondAnimResourses['playing'].push(secondAnimation['id'])
        loadAnim.setAttribute('src', `${dirAnim}${secondAnimResourses['src']}?${secondAnimation['id']}`)
        setTimeout(() => {loadAnim.remove()}, firstAnimResourses['duration'] / 2)

        firstAnimation['timeoutElement'] = setTimeout(() => {
            cropplantedElement.setAttribute('src', `${dirAnim}${secondAnimResourses['src']}?${secondAnimation['id']}`);
            cropplantedElement.dataset.animation = secondAnimName
            removeItemsByValue(firstAnimResourses['playing'], firstAnimation['id'])
        }, firstAnimResourses['duration'])
    }
    
}

// ----------=---------=---------- //

const findId = (cropId, animationName) => {
    for (let i = 0; ;i++) {
        if (!resources[cropId][animationName]['playing'].includes(i)) {
            return i
        }
    }
}

// ----------=---------=---------- //

const removeItemsByValue = (array, value) => {
    let index;
    while ((index = array.indexOf(value)) !== -1) {
      array.splice(index, 1);
    }
}

// ----------=---------=---------- //

const getTextWidth = (textContent, fontSize) => {
    const element = document.createElement('p')
    element.textContent = textContent
    element.style.fontSize = fontSize
    element.style.position = 'absolute'
    element.style.opacity = '0'

    bufferElement.appendChild(element)
    const elementWidth = element.getBoundingClientRect().width
    element.remove()
    return elementWidth
}

// ----------=---------=---------- //

const getNumberColor = (num) => {
    if (num < 0) { 
        return '#992F2E'
    } else if (num > 0) {
        return '#2F9933'
    } else {
        return '#392418'
    }
}

// ----------=---------=---------- //

const remCurrentAnim = (currentAnimation, currentCrop, animationElement) => {
    if (currentAnimation === 'puffAnim') {
        clearTimeout(animationElement['puffAnim']['timeoutElement'])
        removeItemsByValue(resources["soil"]['puffAnim']['playing'], animationElement['puffAnim']['id'])
    }
    
    if (currentAnimation === 'growAnim') {
        clearTimeout(animationElement['growAnim']['timeoutElement'])
        removeItemsByValue(resources[currentCrop]['growAnim']['playing'], animationElement['growAnim']['id'])
    }
    
    if (currentAnimation === 'fullAnim') {
        removeItemsByValue(resources[currentCrop]['fullAnim']['playing'], animationElement['fullAnim']['id'])
    }
}

// ----------=---------=---------- //

const toRem = (num) => {
    const rem = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    return num * rem
}

// ---------- ========= ---------- //






// GET CSS REM VALUE //
const bufferElement = document.querySelector('#buffer')

// SET RESOURCES DIRECTORIES //
const dirImgs = 'src/images/'
const dirAnim = 'src/anim/'


// CREATE A NEW TABLE ELEMENT //
const newTable = document.createElement('table')
newTable.setAttribute('class', 'crops-table')
newTable.innerHTML = `
<tr>
    <th><p>CROPS</p></th>
    <th><img src="${dirImgs}misc/formula.png"></th>
    <th><img src="${dirImgs}misc/compost.png"></th>
    <th><img src="${dirImgs}misc/manure.png"></th>
    <th><img src="${dirImgs}misc/autumn.png"></th>
    <th><img src="${dirImgs}misc/winter.png"></th>
    <th><img src="${dirImgs}misc/spring.png"></th>
    <th><img src="${dirImgs}misc/summer.png"></th>
</tr>
`
document.querySelector('.crops-table_c').appendChild(newTable)


const boxElement = document.querySelector('.box')

const box = []
const table = []
const animationHandler = {}

// ITERATE OVER ALL CROPS //
for (crop in crops) {
    // SET SHORTCUTS //
    const cropId = crops[crop]['cropId']
    const displayName = crops[crop]['displayName']
    const formula = crops[crop]['formula']
    const compost = crops[crop]['compost']
    const manure = crops[crop]['manure']
    const seasons = crops[crop]['seasons']
    const harvestImg = resources[crop]['harvestImg']
    const seedsImg = resources[crop]['seedsImg']

    // CREATE BOX ITEM HTML ELEMENT //
    const newBoxItem = document.createElement('div')
    newBoxItem.setAttribute('class', 'box-item')
    newBoxItem.setAttribute('draggable', 'true')
    newBoxItem.setAttribute('data-croptype', cropId)
    newBoxItem.setAttribute('data-f', formula)
    newBoxItem.setAttribute('data-c', compost)
    newBoxItem.setAttribute('data-m', manure)
    newBoxItem.innerHTML = `
    <img class="harvest" src="${dirImgs}${harvestImg}">
    <img class="seeds" src="${dirImgs}${seedsImg}">
    `

    // HIDE INFO CARD IF CLICK ELSEWHERE //
    

    // CLICK EVENT //
    newBoxItem.addEventListener("click", () => {
        if (document.querySelector('.info-card')) {
            document.querySelector('.info-card').remove()
            box.forEach(boxItem => {
                if (boxItem !== newBoxItem) {
                    boxItem.classList.remove('--info')
                }
            });
        }

        toggleInfo(newBoxItem)

        if (newBoxItem.classList.contains('--info')) {
            let infoCardElementWidth = getTextWidth(displayName,'2.5rem')

            if (infoCardElementWidth < (toRem(13.5))) {
                infoCardElementWidth = toRem(13.5)
            }

            infoCardElementWidth = Math.ceil((infoCardElementWidth + toRem(1)) / toRem(5.62)) * toRem(5.62)

            let left = newBoxItem.getBoundingClientRect().left + toRem(4.5)
            const top = newBoxItem.getBoundingClientRect().top
            const boxElRect = newBoxItem.parentElement.getBoundingClientRect()
            let justifyContent = 'flex-start'

            if ((left + infoCardElementWidth) > (boxElRect.x + boxElRect.width)) {
                left -= infoCardElementWidth + toRem(4.5)
                justifyContent = 'flex-end'
            }

            const newInfoCard = document.createElement('div')
            newInfoCard.setAttribute('class', 'info-card')
            newInfoCard.style.left = `${left}px`
            newInfoCard.style.top = `${top}px`
            newInfoCard.innerHTML = `
            <div class="display-name" style="width:${infoCardElementWidth}px;">
                <p>${displayName}</p>
            </div>
            <div class="fcm-display" style="justify-content:${justifyContent};">
                <div class="formula">
                    <div class="icon">
                        <img src="src/images/misc/formula.png">
                    </div>
                    <div class="value" style="color:${getNumberColor(formula)};">${formula}</div>
                </div>
                <div class="compost">
                    <div class="icon">
                        <img src="src/images/misc/compost.png">
                    </div>
                    <div class="value" style="color:${getNumberColor(compost)};">${compost}</div>
                </div>
                <div class="manure">
                    <div class="icon">
                        <img src="src/images/misc/manure.png">
                    </div>
                    <div class="value" style="color:${getNumberColor(manure)};">${manure}</div>
                </div>
            </div>
            `
            bufferElement.appendChild(newInfoCard)
        }
    });
    
    
    const w = toRem(4.5);
    const h = toRem(4.5);

    // DRAGSTART EVENT //
    newBoxItem.addEventListener('dragstart', dragstartEvent => {
        box.forEach(boxItemElement => {
            boxItemElement.classList.remove("--info");
        });

        dragImage = document.createElement('div')
        dragImage.appendChild(newBoxItem.querySelector('.seeds').cloneNode())

        newBoxItem.querySelector('.seeds').style.opacity = '40%';

        dragstartEvent.dataTransfer.setData('text/plain', [newBoxItem.dataset.croptype])
        dragstartEvent.dataTransfer.setData('custom/source', 'allowed')
        dragstartEvent.dataTransfer.setDragImage(dragImage, 0, 0);
    })

    // DRAGEND EVENT //
    newBoxItem.addEventListener('dragend', () => {
        if (newBoxItem.querySelector('.seeds').style) {
            newBoxItem.querySelector('.seeds').removeAttribute('style')
        }
    })

    let moveElement;
    let touchLocation;
    let notCloned = true
    let isMoving = false

    newBoxItem.addEventListener('touchmove', touchmoveEvent => {
        touchmoveEvent.preventDefault()
        isMoving = true
        if (notCloned) {
            moveElement = document.createElement('img')
            moveElement.setAttribute('class', '.seeds')
            moveElement.setAttribute('src', `${dirImgs}${resources[cropId]['seedsImg']}`)
            moveElement.style.height = h + 'px';
            moveElement.style.position = 'fixed';
            moveElement.style.padding = '0';
            bufferElement.appendChild(moveElement)
            notCloned = false
        }
        touchLocation = touchmoveEvent.targetTouches[0]
        moveElement.style.left = touchLocation.clientX - w/2 + 'px';
        moveElement.style.top = touchLocation.clientY - h/2 + 'px';
    })


    newBoxItem.addEventListener('touchend', () => {
        if (isMoving) {
            xTL1 = touchLocation.clientX;
            yTL1 = touchLocation.clientY;
                
            turf.forEach(newSoil => {
                const targetElRect = newSoil.getBoundingClientRect(),
                    xTL2 = targetElRect.x,
                    yTL2 = targetElRect.y,
                    h2 = targetElRect.height,
                    w2 = targetElRect.width,
                    xBR2 = xTL2 + w2,
                    yBR2 = yTL2 + h2;

        
                if (yTL1 < yTL2 || yTL1 > yBR2 || xTL1 < xTL2 || xTL1 > xBR2) {
                    return false;
                } else {
                    newSoil.style.cursor = 'pointer';

                    const animationElement = animationHandler[newSoil.getAttribute('id')]
                    const cropplantedElement = newSoil.querySelector('.cropplanted')
                    const currentAnimation = cropplantedElement.dataset.animation
                    const currentCrop = newSoil.dataset.cropplanted

                    remCurrentAnim(currentAnimation, currentCrop, animationElement)
                    swapAnimation(cropplantedElement, false, animationElement, [newBoxItem.dataset.croptype, "growAnim"], [newBoxItem.dataset.croptype, "fullAnim"])
                    
                    newSoil.dataset.cropplanted = newBoxItem.dataset.croptype
                    newSoil.dataset.f = crops[newBoxItem.dataset.croptype]['formula']
                    newSoil.dataset.c = crops[newBoxItem.dataset.croptype]['compost']
                    newSoil.dataset.m = crops[newBoxItem.dataset.croptype]['manure']
                    
                    calculateFCM()
            }
            });
            moveElement.remove()
            notCloned = true
            isMoving = false
            if (newBoxItem.querySelector('.seeds').style) {
                newBoxItem.querySelector('.seeds').removeAttribute('style')
            }
        }
    })
      
    box.push(newBoxItem)

    // CREATE TABLE ROWS //
    let autumn, winter, spring, summer
    const newTableRow = document.createElement('tr')

    seasons.includes('autumn') ? autumn = '✓' : autumn = ''
    seasons.includes('winter') ? winter = '✓' : winter = ''
    seasons.includes('spring') ? spring = '✓' : spring = ''
    seasons.includes('summer') ? summer = '✓' : summer = ''

    newTableRow.innerHTML = `
    <td class="table-crop" colspan="2"><img src="${dirImgs}${harvestImg}"><p>${displayName}</p></td>
    <td class="table-fcm" style="color:${getNumberColor(formula)};"><p>${formula}</p></td>
    <td class="table-fcm" style="color:${getNumberColor(compost)};"><p>${compost}</p></td>
    <td class="table-fcm" style="color:${getNumberColor(manure)};"><p>${manure}</p></td>
    <td class="table-seasons"><p>${autumn}</p></td>
    <td class="table-seasons"><p>${winter}</p></td>
    <td class="table-seasons"><p>${spring}</p></td>
    <td class="table-seasons"><p>${summer}</p></td>
    `
    table.push(newTableRow)
}

document.addEventListener("click", clickEvent => {
    if (!box.includes(clickEvent.target.parentElement)) {
        if (document.querySelector('.info-card')) {
            document.querySelector('.info-card').remove()
            box.forEach(boxItem => {
                boxItem.classList.remove('--info')
            });
        }
    }
});

document.addEventListener('dragstart', () => {
    if (document.querySelector('.info-card')) {
        document.querySelector('.info-card').remove()
        box.forEach(boxItem => {
            boxItem.classList.remove('--info')
        });
    }
})

document.addEventListener('touchmove', () => {
    if (document.querySelector('.info-card')) {
        document.querySelector('.info-card').remove()
        box.forEach(boxItem => {
            boxItem.classList.remove('--info')
        });
    }
})




// SORT THE ELEMENTS THEN APPEND IT TO PARENT //
box.sort((a, b) => crops[a.dataset.croptype]['displayName'].localeCompare(crops[b.dataset.croptype]['displayName']))
table.sort((a, b) => a.querySelector('.table-crop').textContent.localeCompare(b.querySelector('.table-crop').textContent))

box.forEach(boxItemElement => {
    boxElement.appendChild(boxItemElement)
});

table.forEach(tableRowElement => {
    newTable.appendChild(tableRowElement)
});


const turfElement = document.querySelector('.turf')
const turf = []

for (let i = 0; i < 9; i++) {
    const tillBackImg = resources['soil']['tillBackImg']
    const tillFrontImg = resources['soil']['tillFrontImg']

    // CREATE SOIL HTML ELEMENT //
    const newSoil = document.createElement('div')
    newSoil.setAttribute('class', 'soil')
    newSoil.setAttribute('id', `soil-${String(i).padStart(2, "0")}`)
    newSoil.setAttribute('draggable', 'true')
    newSoil.setAttribute('data-cropplanted', '')
    newSoil.setAttribute('data-f', '')
    newSoil.setAttribute('data-c', '')
    newSoil.setAttribute('data-m', '')
    newSoil.innerHTML = `
    <img class="cropplanted" src="" data-animation="">
    <img class="soil-back" src="${dirImgs}${tillBackImg}">
    <img class="soil-front" src="${dirImgs}${tillFrontImg}">
    `

    // CHECK IF THERES A CROP PLANTED //
    const cropplantedElement = newSoil.querySelector('.cropplanted')
    const animationElement = animationHandler[newSoil.getAttribute('id')] = {}

    // DRAGSTART EVENT //
    newSoil.addEventListener('dragstart', dragstartEvent => {
        if (newSoil.dataset.cropplanted) {
            dragstartEvent.dataTransfer.setData('text/plain', [newSoil.dataset.cropplanted, newSoil.dataset.f, newSoil.dataset.c, newSoil.dataset.m])
            dragstartEvent.dataTransfer.setData('custom/source', 'allowed')
        } else {dragstartEvent.preventDefault()};
    })

    // DRAGOVER EVENT //
    newSoil.addEventListener('dragover', dragoverEvent => {
        dragoverEvent.preventDefault();
    });

    // DROP EVENT //
    newSoil.addEventListener('drop', dropEvent => {
        if (dropEvent.dataTransfer.getData('custom/source') === 'allowed') {
            newSoil.style.cursor = 'pointer';
            
            const dataTransfered = dropEvent.dataTransfer.getData('text/plain').split(",");
            const currentAnimation = cropplantedElement.dataset.animation
            const currentCrop = newSoil.dataset.cropplanted

            remCurrentAnim(currentAnimation, currentCrop, animationElement)
            swapAnimation(cropplantedElement, false, animationElement, [dataTransfered[0], "growAnim"], [dataTransfered[0], "fullAnim"])
            
            newSoil.dataset.cropplanted = dataTransfered[0]
            newSoil.dataset.f = crops[dataTransfered[0]]['formula']
            newSoil.dataset.c = crops[dataTransfered[0]]['compost']
            newSoil.dataset.m = crops[dataTransfered[0]]['manure']
                        
            calculateFCM()
        } else {
            dropEvent.preventDefault()
        }
        
    })

    let moveElement;
    let touchLocation;
    const w = toRem(4.5);
    const h = toRem(4.5);
    let notCloned = true
    let isMoving = false

    newSoil.addEventListener('touchmove', touchmoveEvent => {
        if (newSoil.dataset.cropplanted) {
            touchmoveEvent.preventDefault()
            isMoving = true
            if (notCloned) {
                moveElement = document.createElement('img')
                moveElement.setAttribute('class', '.seeds')
                moveElement.setAttribute('src', `${dirImgs}${resources[newSoil.dataset.cropplanted]['seedsImg']}`)
                moveElement.style.height = h + 'px';
                moveElement.style.position = 'fixed';
                moveElement.style.padding = '0';
                bufferElement.appendChild(moveElement)
                notCloned = false
            }
            touchLocation = touchmoveEvent.targetTouches[0]
            moveElement.style.left = touchLocation.clientX - w/2 + 'px';
            moveElement.style.top = touchLocation.clientY - h/2 + 'px';
        }
    })

    newSoil.addEventListener('touchend', () => {
        if (isMoving) {
            xTL1 = touchLocation.clientX;
            yTL1 = touchLocation.clientY;
                
            turf.forEach(soilElement => {
                const targetElRect = soilElement.getBoundingClientRect(),
                    xTL2 = targetElRect.x,
                    yTL2 = targetElRect.y,
                    h2 = targetElRect.height,
                    w2 = targetElRect.width,
                    xBR2 = xTL2 + w2,
                    yBR2 = yTL2 + h2;

        
                if (yTL1 < yTL2 || yTL1 > yBR2 || xTL1 < xTL2 || xTL1 > xBR2) {
                    return false;
                } else {
                    soilElement.style.cursor = 'pointer';

                    const animationElement = animationHandler[soilElement.getAttribute('id')]
                    const cropplantedElement = soilElement.querySelector('.cropplanted')
                    const currentAnimation = cropplantedElement.dataset.animation
                    const currentCrop = soilElement.dataset.cropplanted

                    remCurrentAnim(currentAnimation, currentCrop, animationElement)
                    swapAnimation(cropplantedElement, false, animationElement, [newSoil.dataset.cropplanted, "growAnim"], [newSoil.dataset.cropplanted, "fullAnim"])
                    
                    soilElement.dataset.cropplanted = newSoil.dataset.cropplanted
                    soilElement.dataset.f = crops[newSoil.dataset.cropplanted]['formula']
                    soilElement.dataset.c = crops[newSoil.dataset.cropplanted]['compost']
                    soilElement.dataset.m = crops[newSoil.dataset.cropplanted]['manure']
                    
                    calculateFCM()
                }
            });
            moveElement.remove()
            notCloned = true
            isMoving = false
        }
    })

    // CLICK EVENT //
    newSoil.addEventListener('click', () => {
        if (newSoil.dataset.cropplanted) {
            const currentAnimation = cropplantedElement.dataset.animation
            const currentCrop = newSoil.dataset.cropplanted

            remCurrentAnim(currentAnimation, currentCrop, animationElement)

            newSoil.dataset.f = ""
            newSoil.dataset.c = ""
            newSoil.dataset.m = ""
            newSoil.dataset.cropplanted = ""

            calculateFCM()

            swapAnimation(cropplantedElement, true, animationElement, ['soil', 'puffAnim'])
            if (newSoil.getAttribute('style')) {newSoil.removeAttribute('style')}
        }
    })

    turf.push(newSoil)
    turfElement.appendChild(newSoil)
}


const filterBox = document.querySelectorAll('.filter-item')
const filter = []

filterBox.forEach(filterElement => {
    const boxFiltered = [...box]
    filterElement.addEventListener('click', () => {
        const filtertype = filterElement.dataset.filtertype
        
        if (filterElement.classList.contains("--selected")) {
            removeItemsByValue(filter, filtertype)
        } else {
            filter.push(filtertype)
        }

        filterElement.classList.toggle("--selected");

        boxFiltered.forEach(boxItemElement => {
            boxItemElement.remove()
        })

        boxFiltered.forEach(boxItemElement => {
            const croptype = boxItemElement.dataset.croptype
            if(filter.every(filterItem => crops[croptype]['seasons'].includes(filterItem))) {
                boxElement.appendChild(boxItemElement)
            }
            
        });
    })
    
});