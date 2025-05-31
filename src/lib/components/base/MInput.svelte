<script lang="ts">
	interface Props {
		label: string;
		type: "password" | "text" | "email" | "number" | "tel" | "url";
		name: string;
		id?: string;
		required?: boolean;
		autofocus?: boolean;
		placeholder?: string;
		value?: string;
		tabindex?: number;
	}

	let {
		label,
		type,
		name,
		id = name,
		required = false,
		autofocus = false,
		placeholder,
		value = "",
		tabindex = 0
	}: Props = $props();

</script>

<div class="form-group">
	<label for={id}>{label}</label>
	<input
		{type}
		{id}
		{name}
		{required}
		{autofocus}
		{placeholder}
		bind:value
		tabindex={tabindex}
	/>
</div>