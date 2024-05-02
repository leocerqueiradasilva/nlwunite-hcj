// let participantes = [
// 	{
// 		nome: "Leonardo Cerqueira da Silva",
// 		email: "leocs.infogmail.com",
// 		dataIncricao: new Date(2024, 2, 22, 19, 20),
// 		dataCheckIn: null,
// 	},
// ]


// defino uma função de recuperação do storage

const recebeStorage = () => {
  return JSON.parse(localStorage.getItem("participante")) || []; 
};

// converto em um array para trabalhar com map, filter ou outros funcoes do array
let participantes = Array.from(recebeStorage());
	
//funcao que recebe o conteudo de um participante do objeto e monta a linha e as colunas da tabela
const criarNovoParticipante = (participante) => {
	const dataIncricao = dayjs(Date.now()).to(participante.dataIncricao)
	let dataCheckIn = dayjs(Date.now()).to(participante.dataCheckIn)

	if (participante.dataCheckIn == null) {
		dataCheckIn = `<button 
    data-email="${participante.email}" 
    onclick="fazerCheckIn(event)">
    Confirmar check-in
    </button?`
	}

	return `
  <tr>
    <td>
      <strong>
        ${participante.nome}
      </strong>
      <br>
      <small>${participante.email}</small>
    </td>
    <td>${dataIncricao}</td>
    <td>${dataCheckIn}</td>
  </tr>
  `
}

//funcao que recebe o conteudo dos participantes e carrega um a um na tela
const atualizarLista = (participantes) => {
	let output = ""

	for (let participante of participantes) {
		output = output + criarNovoParticipante(participante)
	}

	document.querySelector("tbody").innerHTML = output
}

//chama funcao atualiarLista passando o conteudo do objeto participantes
atualizarLista(participantes)

//clica no botão para realizar incrição
const adicionarParticipante = (event) => {
	event.preventDefault()

	const formData = new FormData(event.target)

	const participante = {
		nome: formData.get("nome"),
		email: formData.get("email"),
		dataInscricao: new Date(),
		dataCheckIn: null,
  }
  
  //Verifica se o email que esta sendo incluido ja existe
  const participanteExiste = participantes.find(
    (p) => p.email == participante.email // versão abreviada sem o return
  )

	if (participanteExiste) {
		
		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.onmouseenter = Swal.stopTimer;
				toast.onmouseleave = Swal.resumeTimer;
			}
		});
		Toast.fire({
			icon: "info",
			title: `E-mail ja cadastrado!`
		});


    // alert('Email já cadastrado!')
    return
	}
	
	participantes = [participante, ...participantes]

	localStorage.setItem('participante', JSON.stringify(participantes))

  atualizarLista(participantes)
  
  //limpa os inputs
  event.target.querySelector('[name="nome"]').value = ""
	event.target.querySelector('[name="email"]').value = ""
	
	const Toast = Swal.mixin({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.onmouseenter = Swal.stopTimer;
			toast.onmouseleave = Swal.resumeTimer;
		}
	});
	Toast.fire({
		icon: "success",
		title: `Participante ${participante.nome} incluido na lista do evento.`
	});

}

//Realiza o checkin apos achar o email ue foi selecionado
const fazerCheckIn = (event) => {

	Swal.fire({
		title: "Check-In",
		text: "Tem certeza que deseja fazer o check-in?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Sim, fazer check-in!"
	}).then((result) => {
		if (result.isConfirmed) {

			//busca participante dentro da lista
			const participante = participantes.find((p) => {
				return p.email == event.target.dataset.email
			})
			//atualiza o check-in do participante no array
			participante.dataCheckIn = new Date()

			localStorage.setItem('participante', JSON.stringify(participantes))

			atualizarLista(participantes)

			Swal.fire({
				title: "Check-In!",
				text: "Check-in efetuado com sucesso.",
				icon: "success"
			});
		}
	});


	//confirmar se realmente ue o check-in
	// const resultado = confirm("Tem certeza que deseja fazer o check-in?")

	// if (resultado) {
	// 	//busca participante dentro da lista
	// 	const participante = participantes.find((p) => {
	// 		return p.email == event.target.dataset.email
	// 	})
	// 	//atualiza o check-in do participante
	// 	participante.dataCheckIn = new Date()
	// 	//atualizar a lista de participanete
	// 	atualizarLista(participantes)
  // }
  
}
