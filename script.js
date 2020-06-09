const synth = window.speechSynthesis;

const inputForm = document.querySelector('form')
const inputTxt = document.querySelector('.txt')


const $AvoiceSelect = document.getElementById('Aselect');
const $Apitch = document.getElementById('Apitch')
const $ApitchValue = document.getElementById('.ApitchValue')
const $Arate = document.getElementById('Arate')
const $ArateValue = document.getElementById('ArateValue')
const $Aplay = document.getElementById('Aplay')

const $local = document.getElementById('local')
const $log = document.getElementById('log')


let voices = [];

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  })


  let selectedIndex = $AvoiceSelect.selectedIndex < 0 ? 0 : $AvoiceSelect.selectedIndex;
  $AvoiceSelect.innerHTML = '';
  $AvoiceSelect.innerHTML = '';

  let words = ""
  for( i=0; i<voices.length; i++ ){
    /* unforneally, named RegEx capture groups aren't in Firefox Stable yet */    
    words = voices[i].name.split(' ')
    voices[i].vendor = words[0]
    voices[i].surname = words[1]
    voices[i].natural = words[3] === '(Natural)' //MicroSoft
    logit( voices[i].surname +' '+ voices[i].vendor +'\tnatural:'+ voices[i].natural +' local:'+ voices[i].localService )
    // voiceList += voices[i].surname +' '+ voices[1].vendor +'\n'
    
    if ( !( $local.checked && !voices[i].localService ) ){
      let option = document.createElement('option')
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')'
      if(voices[i].default) {
        option.textContent += ' = DEFAULT'
      }
      option.setAttribute('data-lang', voices[i].lang)
      option.setAttribute('data-name', voices[i].name)
      $AvoiceSelect.appendChild(option)
    }
  }
  $AvoiceSelect.selectedIndex = selectedIndex
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

$Aplay.onclick = function(){ speak( "A" ) }
$Bplay.onclick = function(){ speak( "B" ) }
function speak( voicePackLetter ){
    if (synth.speaking) {
        logit('Err: speechSynthesis.speaking');
        return;
    }
    if (inputTxt.value !== '') {
    let utterThis = new SpeechSynthesisUtterance(inputTxt.value) //there is no queueing
    utterThis.onend = function (event) {
        logit('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        logit('Err: SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = $AvoiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    if ( voicePackLetter === "A" ){
      utterThis.pitch = $Apitch.value
      utterThis.rate = $Arate.value
    } else {
      utterThis.pitch = $Bpitch.value;
      utterThis.rate = $Brate.value;
    }
    synth.speak(utterThis);
  }
}

// inputForm.onsubmit = function(event) {
//   event.preventDefault();
//   speak();
//   inputTxt.blur();
// }

$Apitch.onchange = function() {
  $ApitchValue.textContent = $Apitch.value;
}
$Arate.onchange = function() {
  $ArateValue.textContent = $Arate.value;
}

$AvoiceSelect.onchange = function(){
  speak();
}


function logit( t ){
	console.log(t)
	$log.value += `\n`+ t
	$log.scrollTop = $log.scrollHeight
}
function copyLog(){
  /* Select the text field */
  $log.select()
  $log.setSelectionRange(0, 99999) /*For mobile devices*/
  document.execCommand("copy")
  alert("Copied the text: " + $log.value);
}
