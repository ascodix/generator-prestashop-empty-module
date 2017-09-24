<?php
/*
 *
 *  @author <%= author %> <<%= authorEmail %>>
 */
if (!defined('_PS_VERSION_')) {
	exit;
}

class <%= className %> extends Module
{

	public function __construct()
	{
		$this->name = '<%= technicalName %>';
		//$this->tab = 'front_office_features';
		$this->version = '<%= version %>';
		$this->author = '<%= author %>';
		$this->need_instance = 0;
		$this->ps_versions_compliancy = array('min' => '1.7.1.0', 'max' => _PS_VERSION_);
		$this->bootstrap = true;

		parent::__construct();

		$this->displayName = $this->trans('<%= displayName %>', array(), 'Modules.<%= moduleName %>.Admin');
		$this->description = $this->trans('<%- description %>.', array(), 'Modules.<%= moduleName %>.Admin');
	}

	public function install()
	{
		if (!parent::install())
			return false;
		return true;
	}

	public function uninstall()
	{
		if (!parent::uninstall())
			return false;
		return true;
	}
}
