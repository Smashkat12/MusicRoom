 <template>
  <div>
  
    <app-header></app-header>
      <section>
        <br>
        <b></b>
        <div class="input-group md-form form-sm form-2 pl-0">
      <input
        class="form-control my-0 py-1 lime-border"
        type="text"
        placeholder="Search track"
        aria-label="Search"
      />
      <div class="input-group-append">
        <span class="input-group-text lime lighten-2" id="basic-text1">
          <mdbIcon icon="search" />
        </span>
      </div>
    </div></section>
    <app-footer></app-footer>
    
  </div>
</template>
    

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
import { mdbIcon } from 'mdbvue';

export default {
  components: {
    "app-header": Header,
    "app-footer": Footer,
    mdbIcon
  },
};
</script>
<style scoped>
  .input-group.md-form.form-sm.form-1 input{
    border: 1px solid #bdbdbd;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
  .input-group.md-form.form-sm.form-2 input {
      border: 1px solid #bdbdbd;
      border-top-left-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
  }
  .input-group.md-form.form-sm.form-2 input.red-border  {
      border: 1px solid #ef9a9a;
  }
  .input-group.md-form.form-sm.form-2 input.lime-border  {
      border: 1px solid #cddc39;
  }
  .input-group.md-form.form-sm.form-2 input.amber-border  {
      border: 1px solid #ffca28;
  }
</style>