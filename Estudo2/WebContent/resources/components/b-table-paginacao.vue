<template>
    <nav>
        <ul class="pagination pagination-sm  justify-content-end">
            <li class="page-item">
                <a href="#" aria-label="Previous" class="page-link" @click="previousPag(-1)">
                    <span aria-hidden="true"><i class="fas fa-angle-double-left"></i></span>
                    <span class="sr-only"><i class="fas fa-angle-double-left"></i></span>
                </a>
            </li>

            <li class="page-item" v-if="current_page - 3 >= 1">
                <a href="#" class="page-link" @click="previousPag(3)">...</a>
            </li>
            <li class="page-item" v-if="current_page - 2 >= 1">
                <a href="#" class="page-link" @click="previousPag(2)">{{current_page - 2}}</a>
            </li>
            <li class="page-item" v-if="current_page - 1 >= 1">
                <a href="#" class="page-link" @click="previousPag(1)">{{current_page - 1}}</a>
            </li>

            <li class="page-item active" >
                <a href="#" class="page-link">{{current_page}}</a>
            </li> 
            <li class="page-item" v-if="current_page + 1 <= total_pages">
                <a href="#" class="page-link" @click="nextPag(1)">{{current_page + 1}}</a>
            </li>
            <li class="page-item" v-if="current_page + 2 <= total_pages">
                <a href="#" class="page-link" @click="nextPag(2)">{{current_page + 2}}</a>
            </li>
            <li class="page-item" v-if="current_page + 3 <= total_pages">
                <a href="#" class="page-link" @click="nextPag(3)">...</a>
            </li>

            <li class="page-item">
                <a href="#" aria-label="Next" class="page-link" @click="nextPag(-1)">
                    <span aria-hidden="true"><i class="fas fa-angle-double-right"></i></span> 
                    <span class="sr-only"><i class="fas fa-angle-double-right"></i></span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
    module.exports = {
        props: ['total_pages'],
        data: function() {
            return{
                current_page: 1
            }
        },
        methods: {
            previousPag(inc){
                const vm = this;
                
                if(inc == -1){
                    vm.current_page = 1;
                    vm.$emit('realiza_busca', vm.current_page);
                }
                else if(vm.current_page > 1){
                    vm.current_page -= inc;
                    vm.$emit('realiza_busca', vm.current_page);
                }
            },
            nextPag(inc){
                const vm = this;
                
                if(inc == -1){
                    vm.current_page = vm.total_pages;
                    vm.$emit('realiza_busca', vm.current_page);
                }
                else if(vm.current_page < vm.total_pages){
                    vm.current_page += inc;
                    vm.$emit('realiza_busca', vm.current_page);
                }
            }
        }
    }
</script>
