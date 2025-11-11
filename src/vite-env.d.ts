/// <references types="vite/client" />

type ImportMetaEnv = {
	readonly VITE_BACKLOG_SPACES: string | undefined;
};

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
