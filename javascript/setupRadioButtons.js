export default function setupRadioButtons() {
  const radioButtons = document.querySelectorAll('.sidebar input[type=radio]')

  radioButtons.forEach(button => {
    button.addEventListener('click', selectOption)
  })
}

function selectOption(event) {
  const option = event.target

  updateURLParameters(option)
}

function updateURLParameters(option) {
  const url = new URL(window.location)
  url.searchParams.set(option.name, option.value)

  window.history.pushState({}, undefined, url)
}