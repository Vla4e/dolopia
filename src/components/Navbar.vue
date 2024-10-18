<template>
  <div class="navbar">
    <router-link to="/">
      <img src="@/assets/dolopia-logo-black.png" alt="Dolopia logo" class="navbar-logo" />
    </router-link>
    <div class="link-container">
      <router-link to="/" class="navbar-link">
        Home
      </router-link>
      <router-link to="/categories" class="navbar-link">
        Categories
      </router-link>
      <router-link to="/about" class="navbar-link">
        About
      </router-link>
      <router-link to="/contact" class="navbar-link">
        Contact
      </router-link>
    </div>
    <img src="@/assets/search-icon.png" class="search-icon"/>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.navbar{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin: auto;
  padding-top: 2vh;
  padding-bottom: 2vh;
  padding-right: 2vw;
  z-index: 2;
  .navbar-logo{
    max-height: 62px;
    margin-right: 20px;
  }
  .link-container{
    display: flex;
    .navbar-link{
      font-family: 'Century Gothic';
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      color: #000000;
      margin-right: 30px;
      padding: 0px;
      cursor:pointer;
    }
  }
  .search-icon{
    justify-self: flex-end;
    margin-left: auto;
    max-height: 30px;
  }
}
</style>