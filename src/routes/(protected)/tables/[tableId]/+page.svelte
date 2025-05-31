<script lang="ts">
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

</script>

<div class="callout-success">
	En construction !
</div>

{data.records.length} records

<pre>
	{JSON.stringify(data, null, 2)}
</pre>