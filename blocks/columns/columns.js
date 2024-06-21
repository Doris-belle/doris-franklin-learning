
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);;
  // setup image columns
  [...block.children].forEach((row, i) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });

  });
  if (block.classList.contains("tttt")) {
    const quizStartClass = ["quiz-start-check", "quiz-disclaimer"];
    [...block.children].forEach((row, i) => {
      row.className = quizStartClass[i];

      // if (row.querySelector("a")) {
        [...row.children].forEach((col, index) => {
          if(col.querySelector("a")) {
            col.className = 'quiz-start-check-box'
            const quizInputBox = document.createElement("div")
            col.prepend(quizInputBox);  
				    const quizInput = document.createElement("input")
            quizInput.setAttribute("type", "checkbox")
            quizInput.className = "form-checkbox";
            const quizLabel = document.createElement("label")
            quizInputBox.appendChild(quizInput)
            quizInputBox.appendChild(quizLabel)
            const startQuizBtn = col.querySelector('.button-container')
            startQuizBtn.parentNode.insertBefore(quizInputBox, startQuizBtn);
          }
        });

			// }
    })

    // if (row.querySelector("a")) {
    //   const quizLabel = document.createElement("label");
    //   const quizInput = document.createElement("input");
    //   quizInput.setAttribute("type", "checkbox");
    //   quizInput.className = "form-checkbox";
    //   quizLabel.appendChild(quizInput);
    //   quizLabel.appendChild(row.children[0]);

    //   row.prepend(quizLabel);
    // }
  }
}
