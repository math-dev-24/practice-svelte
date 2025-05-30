<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import { page } from '$app/state';

	let { children, data }: { children: any, data: LayoutData } = $props();


	function isCurrentPath(path: string): string {
		if (page.url.pathname === path) {
			return "currentPage"
		}
		return "link";
	}

</script>



<header class="flex container mx-auto mb-4 border-b pb-2 pt-4">
	<h1 class="text-xl flex-1">Svelte practice</h1>
	<nav>
		<ul class="flex gap-4 items-center">
			<li>
				<a
					href="/"
					class={isCurrentPath('/')}
				>
					Home
				</a>
			</li>

			{#if data.user}
				<li>
					<a
						href="/todos"
						class={isCurrentPath('/todos')}
					>
						Todo | {data.todoCount}
					</a>
				</li>
				<li>
					<a
						href="/profil"
						class={isCurrentPath('/profil')}
					>
						Profil
					</a>
				</li>
				<li>
					<form method="post" action="/logout">
						<button
							class="btn"
						>
							Déconnexion
						</button>
					</form>
				</li>
			{:else}
				<li><a href="/login">Connexion</a></li>
				<li><a href="/login">Inscription</a></li>
			{/if}
		</ul>
	</nav>
</header>

<main class="container mx-auto">
	{@render children()}
</main>

