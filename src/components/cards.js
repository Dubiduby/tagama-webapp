import "../assets/styles/main.css";
import { getCurrentUser, uploadUserArrays } from "../api/apiUsers";

export function workshopCards(workshop, subcategory, category ) {
    const card = document.createElement("div");
    card.className = "workshop-card";

    const imageUrl = workshop.imageUrl ? workshop.imageUrl :new URL("../assets/images/no-image-default.jpg", import.meta.url).href ;

    const divCardImage = document.createElement("div");
    divCardImage.className= "card-image";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Workshop Image";
    //divCardImage.appendChild(img);

    const buttonAdd = document.createElement("button");
    buttonAdd.className="add-btn";
    buttonAdd.innerHTML = `<img src="${new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href}" alt="Add to the list">`;
    buttonAdd.setAttribute("data-workshop-id", workshop.id);
    buttonAdd.setAttribute("aria-label", "Add to the list");

    const currentUser = getCurrentUser();
if (currentUser && currentUser.savedWorkshops.includes(workshop.id)) {
  // Si el workshop está guardado, muestra el icono de "Added"
  buttonAdd.innerHTML = `<img src="${new URL("../assets/images/bookmark-check.svg", import.meta.url).href}" alt="Added to the list">`;
} else {
  // Si no está guardado, muestra el icono normal
  buttonAdd.innerHTML = `<img src="${new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href}" alt="Add to the list">`;
}
    

    const divCardInfo= document.createElement("div");
    divCardInfo.className = "card-info";
    const titleCard = document.createElement("h3");
    titleCard.textContent = workshop.title;
    // divCardInfo.appendChild(titleCard);

    const divCardDetails=document.createElement("div");
    divCardDetails.className="card-details";

    const dateSpan = document.createElement("span");
    dateSpan.className = "date";
    dateSpan.innerHTML =`<img src="${new URL("../assets/images/calendar.svg", import.meta.url).href}" alt="Calendar">  ${workshop.date}`;
    //dateSpan.textContent= workshop.date;

    const locationSpan = document.createElement("span");
    locationSpan.className = "location";
    locationSpan.innerHTML =`<img src="${new URL("../assets/images/location-pin.svg", import.meta.url).href}" alt="Location">  ${workshop.mode}`;

    const durationSpan = document.createElement("span");
    durationSpan.className = "duration";
    durationSpan.innerHTML =`<img src="${new URL("../assets/images/time.svg", import.meta.url).href}" alt="Duration">  ${workshop.duration} min`;

    const spots = document.createElement("span");
    spots.className = "spots";
    spots.innerHTML =`<img src="${new URL("../assets/images/spots.svg", import.meta.url).href}" alt="Spots">  ${workshop.enrolled.length}/${workshop.capacity}`;

    const workshopPrice = document.createElement("p");
    workshopPrice.textContent = `${workshop.price}€`;

    const workshopTags = document.createElement("span");
    workshopTags.className = "tags";
    workshopTags.textContent = `${subcategory?.name || ""}/ ${category?.name || ""}`;

    card.appendChild(divCardImage);
    divCardImage.appendChild(img);
    divCardImage.appendChild(buttonAdd);

    card.appendChild(divCardInfo);
    divCardInfo.appendChild(titleCard);
    divCardInfo.appendChild(divCardDetails);

    divCardDetails.appendChild(dateSpan);
    divCardDetails.appendChild(locationSpan);
    divCardDetails.appendChild(durationSpan);
    divCardDetails.appendChild(spots);
    divCardDetails.appendChild(workshopPrice);
    divCardDetails.appendChild(workshopTags);


    //TODO:Add event listener icon saved
    buttonAdd.addEventListener("click", ()=>{
        const currentUser = getCurrentUser();
        // Verifica si ya está guardado y en que posición se encuentra:
  const position= currentUser.savedWorkshops.indexOf(workshop.id);
        if(position === -1){
            // No está guardado, entonces lo añadimos
            currentUser.savedWorkshops.push(workshop.id);
            buttonAdd.innerHTML = `<img src="${new URL("../assets/images/bookmark-check.svg", import.meta.url).href}" alt="Added to the list">`;
            buttonAdd.setAttribute("data-workshop-id", workshop.id);
        }else{
            // Ya está guardado, entonces lo eliminamos
            currentUser.savedWorkshops.splice(position, 1);
            buttonAdd.innerHTML = `<img src="${new URL("../assets/images/bookmark_Plus.svg", import.meta.url).href}" alt="Add to the list">`;
            buttonAdd.setAttribute("data-workshop-id", workshop.id);  
        }
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        uploadUserArrays(currentUser);
    });
  
    //added so be able to go to the detail page
    const cardLink = document.createElement("a");
    cardLink.href = `/workshops/${workshop.id}`;
    cardLink.setAttribute("data-link", "");
    cardLink.appendChild(card);

    return cardLink;


}

