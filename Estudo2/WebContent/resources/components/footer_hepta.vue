<template>
	<footer>
		<div class="footerSpacing"></div>
		<div class="footer" id="footer">
			<span> Criado por: Hepta Tecnologia - {{versao}}</span>
		</div>
	</footer>
</template>
<script>
	module.exports = {
    	data: function() {
    		return{
				versao: ""
			}
		},
		methods: {
			buscaVersao() {
				const vm = this;
				iniciaLoader("loader-primario");

				axios.get('https://gitlab.com/api/v4/projects/desenvolvimento-hepta%2Fsgh/repository/tags', 
				{
					headers: {
					'Content-Type': 'application/json',
					'PRIVATE-TOKEN': 'pH18LRPuLMz1zgGFtmK7'
					}
				})
				.then(function (response) {
					var result = response.data[0];
					var commit = result.commit;
					var data = new Date(commit.committed_date);
					vm.versao = result.name + " de " + data.toLocaleDateString();
				})
				.catch(function (error) {
					console.log(error);
				}).finally(function(){
					encerraLoader("loader-primario");
				});
			}
		},
		created: function() {
			const vm = this;

			iniciaLoader("loader-primario");
			vm.buscaVersao();
			encerraLoader("loader-primario");
		}
	}
</script>
