const participants = ['zbelova', 'Marysemm', 'Bemadler', 'Shenfeldt84', 'vitalia-kokhanova'];

async function getUserData(participant) {
    const response = await fetch(`https://api.github.com/users/${participant}`);
    const data = await response.json();
    return data;
}

function displayParticipantData(participant) {
    const participantsElement = document.querySelector('#participants');
    const participantElement = document.createElement('div');
    participantElement.classList.add("participant");
    participantElement.innerHTML = `<div class="participant__avatar"><img src="${participant.avatar_url}" class="avatar" alt="Аватарка участницы"></div>
                            <div class="participant__info">
                                <h4 class="participant__name">${participant.name}</h4>
                                <a href="${participant.html_url}" class="participant__github">Github</s>
                            </div>`;
    participantsElement.appendChild(participantElement);
}

participants.forEach(participant => {
    getUserData(participant)
        .then(displayParticipantData)
        .catch(error => console.log(error));
});