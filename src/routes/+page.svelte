<script lang="ts">
    let timer : number;
    let count = 0;
    let typed = '';
    function increment(){
        count = count + 1;
    }
    const debounce = (wait : number) => (e : Event)=> {
        clearTimeout(timer);
        timer = setTimeout(()=>{
            typed = (e.target as HTMLInputElement).value;
        },wait)
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p>Look at this thing {count}</p>
<button on:click={increment}>Click me</button>
<input type="text" on:input={debounce(500)}> 
<p>I make what you typed BIG</p>
<p>{typed.toUpperCase()}</p>

<div class='boxy'>
Boxy
</div>


<style>

.boxy{
    width:300px;
    height:300px;
    /* text-align: center; */
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    margin:0 auto;

    box-shadow: 0 0 10px 0px red;
}

</style>