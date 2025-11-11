/// <references types="vite/client" />

declare module "*.css" {
	const content: string;
	export default content;
}

type ImportMetaEnv = {
	readonly VITE_BACKLOG_SPACES: string | undefined;
};

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
