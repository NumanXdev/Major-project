
(() => {          /*Self executing anonymous function also known as an Immediately Invoked Function Expression or IIFE). It runs as soon as it is defined, ensuring that the code inside it doesn’t pollute the global namespace. */
    'use strict' //also known as an Immediately Invoked Function Expression or IIFE). It runs as soon as it is defined, ensuring that the code inside it doesn’t pollute the global namespace.
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission

    /* 
    The code converts the NodeList returned by querySelectorAll() into an array using Array.from() and then iterates over it using .forEach(). This allows us to handle each form individually.
    */
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {

        /*
        The form.checkValidity() method is a built-in JavaScript function that checks if the form is valid according to the HTML5 form validation rules (like required, min, pattern, etc.). If the form is not valid (i.e., it returns false), the function prevents the form from being submitted.

event.preventDefault(): Stops the default form submission behavior (i.e., the form data is not sent to the server).
event.stopPropagation(): Stops the event from bubbling up to parent elements, ensuring that only the current event is handled. 
        */
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()